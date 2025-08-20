import { inject, Injectable } from '@angular/core';
import { MasterApiService } from './api-type/master-api.service';
import { ConfigApiService } from './api-type/config-api.service';
import { ResponsibilitiesService } from './responsibilities.service';
import { API_STATUS } from '../enums/api-details';
import { TransactionApiService } from './api-type/transaction-api.service';
import { IApiDetails, IApiResponse } from '../models/api.interface';
import { CommunicationService } from './communication.service';

@Injectable({
  providedIn: 'root',
})
export class SyncApiService {
  private masterApiService: MasterApiService = inject(MasterApiService);
  private configApiService: ConfigApiService = inject(ConfigApiService);
  private responsibilitiesService: ResponsibilitiesService = inject(
    ResponsibilitiesService
  );
  private transactionApiService: TransactionApiService = inject(
    TransactionApiService
  );
  private commonService: CommunicationService = inject(CommunicationService);

  constructor() {}

  async syncApi(isDelta: boolean = false) {
    let responses: Promise<IApiResponse>[] = [];

    if (isDelta) {
      responses = this.transactionApiService.getTransactionApiResponse(true);
    } else {
      responses = [
        ...this.masterApiService.getAllMaterApiResonses(),
        ...this.configApiService.getConfigApiResponse(),
        ...this.transactionApiService.getTransactionApiResponse(false),
      ];
    }

    const promises = responses.map((apiResponse) => {
      apiResponse
        .then((apiResponse) => {
          if (apiResponse.statusCode === 204) {
            this.responsibilitiesService.updateApiStatus(
              apiResponse.responsibility,
              API_STATUS.NO_CONTENT
            );
          } else if (apiResponse.statusCode === 500) {
            this.responsibilitiesService.updateApiStatus(
              apiResponse.responsibility,
              API_STATUS.FAILED
            );
          } else if (apiResponse.statusCode == 200) {
            this.responsibilitiesService.updateApiStatus(
              apiResponse.responsibility,
              API_STATUS.SUCCESS
            );
          }
          return apiResponse;
        })
        .catch((err) => {
          console.error('Error in api sync', err);
          const fallback: IApiResponse = {
            responsibility: err.responsibility,
            apiType: err.apiType,
            statusCode: 500,
            message: 'Error occurred',
          };
          this.responsibilitiesService.updateApiStatus(
            err.responsibility,
            API_STATUS.FAILED
          );
          return fallback;
        });
    });
    await Promise.all(promises);
  }

  async syncFailedApis(apis: IApiDetails[]) {
    const resyncPromises = apis.map(async (api) => {
      this.responsibilitiesService.updateApiStatus(
        api.responsibility,
        API_STATUS.PENDING
      );
      try {
        const response: IApiResponse =
          await this.commonService.handleApiResponse(api);
        let newStatus = API_STATUS.INITIAL;
        if (response.statusCode === 200) {
          newStatus = API_STATUS.SUCCESS;
        } else if (response.statusCode === 500) {
          newStatus = API_STATUS.FAILED;
        } else if (response.statusCode == 204) {
          newStatus = API_STATUS.NO_CONTENT;
        }

        this.responsibilitiesService.updateApiStatus(
          api.responsibility,
          newStatus
        );
      } catch (err) {
        console.log('error in resyncing:', err);
        this.responsibilitiesService.updateApiStatus(
          api.responsibility,
          API_STATUS.FAILED
        );
      }
    });
    await Promise.all(resyncPromises);
  }
}
