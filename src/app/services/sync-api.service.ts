import { Inject, inject, Injectable, Injector } from '@angular/core';
import { MasterApiService } from './master-api.service';
import { ConfigApiService } from './config-api.service';
import { ResponsibilitiesService } from './responsibilities.service';
import { API_STATUS } from '../enums/api-details';
import { TransactionApiService } from './transaction-api.service';

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

  constructor() {}

  async syncApi(isDelta: boolean) {
    const responses = await Promise.all([
      ...this.masterApiService.getAllMaterApiResonses(),
      ...this.configApiService.getConfigApiResponse(),
      ...this.transactionApiService.getTransactionApiResponse(),
    ]);

    responses.forEach((apiResponse) => {
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
    });
  }
}
