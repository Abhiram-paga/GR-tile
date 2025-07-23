import { inject, Injectable } from '@angular/core';
import { ApiRequestService } from './api-request.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMetadata, IOrg } from '../models/user.interface';
import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  private apiService: ApiRequestService = inject(ApiRequestService);
  private sqliteService:SqliteService=inject(SqliteService)

    organizationsSub = new BehaviorSubject<IOrg[]>([]);
  organizations$: Observable<IOrg[]> = this.organizationsSub.asObservable();

  defaultOrgId:string='';
  selectedOrdId:string='';

  getInventoryOrganizationsTable(defaulOrgID: string) {
    return this.apiService.request(
      'GET',
      `23A/getInventoryOrganizationsTable/${defaulOrgID}`,
      {}
    );
  }



   async handleGetOrganizationTableRes(jsonRes: IOrg[], metaData: IMetadata[]) {
    await this.sqliteService.createTable(metaData, 'organizationTable');
    await this.sqliteService.deleteAllRows('organizationTable');
    await this.sqliteService.insertValuesToTable(
      'organizationTable',
      jsonRes,
      metaData
    );
  }
}
