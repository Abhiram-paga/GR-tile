import { inject, Injectable } from '@angular/core';
import { ResponsibilitiesService } from './responsibilities.service';
import { IApiDetails } from '../models/api.interface';
import { API_TYPE } from '../enums/api-details';
import { CommunicationService } from './communication.service';

@Injectable({
  providedIn: 'root',
})
export class MasterApiService {
  private responsibilitiesService: ResponsibilitiesService = inject(
    ResponsibilitiesService
  );
  private commonService: CommunicationService = inject(CommunicationService);

  masterApis: IApiDetails[] = [];

  constructor() {
    this.masterApis = this.responsibilitiesService.ALL_API_LIST.filter(
      (api) => api.type === API_TYPE.MASTER
    );
  }

  getAllMaterApiResonses() {
    return this.masterApis.map((api: IApiDetails) => {
      return this.commonService.handleApiResponse(api);
    });
  }
}
