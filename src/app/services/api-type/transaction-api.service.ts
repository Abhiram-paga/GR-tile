import { inject, Injectable } from '@angular/core';
import { ResponsibilitiesService } from '../responsibilities.service';
import { CommunicationService } from '../communication.service';
import { IApiDetails } from '../../models/api.interface';
import { API_TYPE } from '../../enums/api-details';

@Injectable({
  providedIn: 'root',
})
export class TransactionApiService {
  private responsibilitiesService: ResponsibilitiesService = inject(
    ResponsibilitiesService
  );
  private commonService: CommunicationService = inject(CommunicationService);

  transactionsApi: IApiDetails[] = [];

  constructor() {
    this.transactionsApi = this.responsibilitiesService.ALL_API_LIST.filter(
      (api) => api.type === API_TYPE.TRANSACTIONAL
    );
  }

  getTransactionApiResponse(isDelta: boolean = false) {
    const dateTime = this.commonService.getDateTimeToMakeDeltaSync();
    return this.transactionsApi.map(async (api: IApiDetails) => {
      const apiCopy = { ...api };

      if (isDelta) {
        if (apiCopy.apiUrl.includes('%22%22')) {
          apiCopy.apiUrl = apiCopy.apiUrl.replace(
            '%22%22',
            encodeURIComponent(dateTime)
          );
        }
      }
      const apisResponsibilities =
        await this.responsibilitiesService.getResponsibilities();
      if (apisResponsibilities.includes(api.responsibility)) {
        return this.commonService.handleApiResponse(apiCopy, isDelta);
      } else {
        return {
          responsibility: api.responsibility,
          apiType: API_TYPE,
          statusCode: 500,
          message: 'Not in responsibilities',
        };
      }
    });
  }
}
