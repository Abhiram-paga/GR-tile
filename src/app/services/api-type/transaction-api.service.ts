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

  getTransactionApiResponse() {
    return this.transactionsApi.map(async (api: IApiDetails) => {
      const apisResponsibilities =
        await this.responsibilitiesService.getResponsibilities();
      if (apisResponsibilities.includes(api.responsibility)) {
        return this.commonService.handleApiResponse(api);
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
