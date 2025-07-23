export interface IUser {
  username: string;
  password: string | number;
}

export interface IRoot {
  metadata: IMetadata[];
  data: IData[];
}

export interface IMetadata {
  name: string;
  type: string;
  primaryKey?: string ;
}

export interface IData {
  STATUS: string;
  USER_NAME: string;
  USER_ID: string;
  TIMESTAMP: string;
  TIMEZONE_OFFSET: string;
  FULL_NAME: string;
  PERSON_ID: string;
  RESPONSIBILITY: string;
  SET_OF_BOOK_ID: string;
  DEFAULT_ORG_ID: string;
  DEFAULT_OU_NAME: string;
  DEFAULT_INV_ORG_ID: string;
  DEFAULT_INV_ORG_NAME: string;
  DEFAULT_INV_ORG_CODE: string;
  RESPONSIBILITY_ID: string;
  RESP_APPLICATION_ID: string;
}

export interface IOrg {
  BusinessUnitId: string;
  BusinessUnitName: string;
  DefaultDestSubInventory: string;
  InventoryOrgCode: string;
  InventoryOrgId_PK: string;
  InventoryOrgName: string;
  IsWMSEnabled: string;
  LastUpdateDate: string;
  MasterOrganizationId: string;
  SiteType: null;
}
