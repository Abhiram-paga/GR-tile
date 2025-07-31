import { inject, Injectable } from '@angular/core';
import { ApiRequestService } from './api-request.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IOrg } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  private apiService: ApiRequestService = inject(ApiRequestService);

  organizationsSub = new BehaviorSubject<IOrg[]>([]);
  organizations$: Observable<IOrg[]> = this.organizationsSub.asObservable();

  defaultOrgId: string = '';
  selectedOrgId: string = '';
  selectedBusinessUnitId: string = '';
  selectedOrgCode: string = '';

  getInventoryOrganizationsTable(defaulOrgID: string) {
    return this.apiService.request(
      'GET',
      `/EBS/23A/getInventoryOrganizationsTable/${defaulOrgID}`
    );
  }

  
}
