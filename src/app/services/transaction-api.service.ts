import { inject, Injectable } from '@angular/core';
import { ResponsibilitiesService } from './responsibilities.service';
import { CommunicationService } from './communication.service';
import { IApiDetails } from '../models/api.interface';
import { API_TYPE } from '../enums/api-details';

@Injectable({
  providedIn: 'root',
})
export class TransactionApiService {
  private responsibilitiesService: ResponsibilitiesService = inject(
    ResponsibilitiesService
  );
  private commomService: CommunicationService = inject(CommunicationService);

  transactionsApi: IApiDetails[] = [];

  constructor() {
    this.transactionsApi = this.responsibilitiesService.ALL_API_LIST.filter(
      (api) => api.type === API_TYPE.TRANSACTIONAL
    );
  }

  getTransactionApiResponse() {
    return this.transactionsApi.map((api: IApiDetails) => {
      return this.commomService.handleApiResponse(api);
    });
  }
}
