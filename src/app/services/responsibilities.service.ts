import { inject, Injectable } from '@angular/core';
import {
  API_RESPONSIBILITY,
  API_STATUS,
  API_TABLE_NAMES,
  API_TYPE,
} from '../enums/api-details';
import { OrganisationService } from './organisation.service';
import { SqliteService } from './sqlite.service';
import { USER_RESPONSIBILIES } from '../enums/user';
import { IApiDetails } from '../models/api.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsibilitiesService {
  constructor() {}

  private organizationService: OrganisationService =
    inject(OrganisationService);
  private sqliteService: SqliteService = inject(SqliteService);

  ALL_API_LIST: IApiDetails[] = [
    {
      isCsv: true,
      metadataUrl: '',
      apiUrl: `/EBS/20D/getItemsTable/${localStorage.getItem(
        'selectedInvOrgId'
      )}/%22%22`,
      type: API_TYPE.MASTER,
      tableName: API_TABLE_NAMES.GET_ITEMS,
      apiStatus: API_STATUS.INITIAL,
      responseKey: '',
      responsibility: API_RESPONSIBILITY.GET_ITEMS,
      message: 'Get Items Table',
    },
    {
      isCsv: true,
      metadataUrl: '',
      apiUrl: `/EBS/22A/getSerialTableType/${localStorage.getItem(
        'selectedInvOrgId'
      )}/%22%22/473574/476650`,
      type: API_TYPE.TRANSACTIONAL,
      tableName: API_TABLE_NAMES.GET_SERIALS_TABLE_TYPE,
      apiStatus: API_STATUS.INITIAL,
      responseKey: '',
      responsibility: API_RESPONSIBILITY.GET_SERIALS_TABLE_TYPE,
      message: 'Serial Table Type',
    },
    {
      isCsv: false,
      metadataUrl: `/EBS/20D/getSubinventories/metadata`,
      apiUrl: `/EBS/20D/getSubinventories/${localStorage.getItem(
        'selectedInvOrgId'
      )}/%22null%22/%22Y%22/`,
      type: API_TYPE.MASTER,
      tableName: API_TABLE_NAMES.GET_SUBINVENTORIES,
      apiStatus: API_STATUS.INITIAL,
      responseKey: 'ActiveSubInventories',
      responsibility: API_RESPONSIBILITY.GET_SUBINVENTORIES,
      message: 'Get Subinventories',
    },
    {
      isCsv: true,
      metadataUrl: '',
      apiUrl: `/EBS/23A/getLocatorsTable/${localStorage.getItem(
        'selectedInvOrgId'
      )}/%22%22`,
      type: API_TYPE.MASTER,
      tableName: API_TABLE_NAMES.GET_LOCATORS,
      apiStatus: API_STATUS.INITIAL,
      responseKey: '',
      responsibility: API_RESPONSIBILITY.GET_LOCATORS,
      message: 'Get Locators Table',
    },
    {
      isCsv: false,
      metadataUrl: '/EBS/20D/getGLPeriodsmetadata',
      apiUrl: `/EBS/20D/getGLPeriods/${localStorage.getItem('defaultOrgId')}`,
      type: API_TYPE.CONFIG,
      tableName: API_TABLE_NAMES.GET_GL_PERIODS,
      apiStatus: API_STATUS.INITIAL,
      responseKey: 'GLPeriods',
      responsibility: API_RESPONSIBILITY.GET_GL_PERIODS,
      message: 'Get GLPeriods',
    },
    {
      isCsv: false,
      metadataUrl: '/EBS/20D/getDocumentsForReceiving/metadata',
      apiUrl: `/EBS/20D/getDocumentsForReceiving/${localStorage.getItem(
        'selectedInvOrgId'
      )}/%22%22/%22Y%22`,
      type: API_TYPE.TRANSACTIONAL,
      tableName: API_TABLE_NAMES.GET_DOCUMENTS_FOR_RECEIVING,
      apiStatus: API_STATUS.INITIAL,
      responseKey: 'Docs4Receiving',
      responsibility: API_RESPONSIBILITY.GET_DOCUMENTS_FOR_RECEIVING,
      message: 'Get Documents For Receiving',
    },
    {
      isCsv: true,
      metadataUrl: '',
      apiUrl: `/EBS/22A/getLotsTableType/${localStorage.getItem(
        'selectedInvOrgId'
      )}/%22%22`,
      type: API_TYPE.TRANSACTIONAL,
      tableName: API_TABLE_NAMES.GET_LOTS_TABLE_TYPE,
      apiStatus: API_STATUS.INITIAL,
      responseKey: '',
      responsibility: API_RESPONSIBILITY.GET_LOTS_TABLE_TYPE,
      message: 'Get Lots Table Type',
    },
    {
      isCsv: true,
      metadataUrl: '',
      apiUrl: `/EBS/22C/getOnHandWMSFilterTableType/${localStorage.getItem(
        'selectedInvOrgId'
      )}/Central/''/S-16190`,
      type: API_TYPE.TRANSACTIONAL,
      tableName: API_TABLE_NAMES.GET_ON_HAND_WMS_FILTER_TABLE,
      apiStatus: API_STATUS.INITIAL,
      responseKey: '',
      responsibility: API_RESPONSIBILITY.GET_ON_HAND_WMS_FILTER_TABLE,
      message: 'Get On Hands WMS Filters',
    },
    {
      isCsv: false,
      metadataUrl: '/EBS/20D/getInventoryPeriods/metadata',
      apiUrl: `/EBS/20D/getInventoryPeriods/${localStorage.getItem(
        'businessUnitId'
      )}/${localStorage.getItem('selectedInvOrgId')}`,
      type: API_TYPE.CONFIG,
      tableName: API_TABLE_NAMES.GET_INVENTORY_PERIODS,
      apiStatus: API_STATUS.INITIAL,
      responseKey: 'InventoryPeriods',
      responsibility: API_RESPONSIBILITY.GET_INVENTORY_PERIODS,
      message: 'Get Inventory Periods',
    },
    {
      isCsv: false,
      metadataUrl: '/EBS/20D/getLocations/metadata',
      apiUrl: '/EBS/20D/getLocations/%22null%22/%22Y%22',
      type: API_TYPE.MASTER,
      tableName: API_TABLE_NAMES.GET_LOCATIONS,
      apiStatus: API_STATUS.INITIAL,
      responseKey: 'LocationList',
      responsibility: API_RESPONSIBILITY.GET_LOCATIONS,
      message: 'Get Locations',
    },
    {
      isCsv: true,
      metadataUrl: '',
      apiUrl: `/EBS/22A/getOnhandTableType/${localStorage.getItem(
        'selectedInvOrgId'
      )}`,
      type: API_TYPE.TRANSACTIONAL,
      tableName: API_TABLE_NAMES.GET_ON_HAND_TABLE_TYPE,
      apiStatus: API_STATUS.INITIAL,
      responseKey: '',
      responsibility: API_RESPONSIBILITY.GET_ON_HAND_TABLE_TYPE,
      message: 'Get onHand',
    },
  ];

  apiStatusSubject = new BehaviorSubject<IApiDetails[]>(this.ALL_API_LIST);
  apiStatus$: Observable<IApiDetails[]> = this.apiStatusSubject.asObservable();

  async getResponsibilities() {
    try {
      let apisResponsibilities: string[] = [];
      let userLoginApiResponse: string[] = (
        await this.sqliteService.getTableRows<{ RESPONSIBILITY: string }>(
          API_TABLE_NAMES.LOGIN
        )
      ).map((responsibility) => {
        return responsibility.RESPONSIBILITY;
      });
      if (userLoginApiResponse.includes(USER_RESPONSIBILIES.GOOD_RECEIPT)) {
        apisResponsibilities.push(API_RESPONSIBILITY.GET_ITEMS);
        apisResponsibilities.push(API_RESPONSIBILITY.GET_SERIALS_TABLE_TYPE);
        apisResponsibilities.push(API_RESPONSIBILITY.GET_SUBINVENTORIES);
        apisResponsibilities.push(API_RESPONSIBILITY.GET_GL_PERIODS);
        apisResponsibilities.push(API_RESPONSIBILITY.GET_LOCATORS);
        apisResponsibilities.push(API_RESPONSIBILITY.GET_LOCATIONS);
        apisResponsibilities.push(API_RESPONSIBILITY.GET_INVENTORY_PERIODS);
        apisResponsibilities.push(API_RESPONSIBILITY.GET_ON_HAND_TABLE_TYPE);
        apisResponsibilities.push(
          API_RESPONSIBILITY.GET_DOCUMENTS_FOR_RECEIVING
        );
        apisResponsibilities.push(API_RESPONSIBILITY.GET_ON_HAND_WMS_FILTER_TABLE)
        apisResponsibilities.push(API_RESPONSIBILITY.GET_LOTS_TABLE_TYPE);
      }

      return apisResponsibilities;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  updateApiStatus(responsibility: string, newStatus: API_STATUS) {
    const index = this.ALL_API_LIST.findIndex(
      (api) => api.responsibility === responsibility
    );
    if (index !== -1) {
      this.ALL_API_LIST[index].apiStatus = newStatus;
      this.apiStatusSubject.next([...this.ALL_API_LIST]);
    }
  }
}
