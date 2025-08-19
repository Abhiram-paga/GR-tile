export interface ISubInventory {
  Flag: string;
  InventoryOrgId: number;
  IsLocatorControlled: boolean;
  LastUpdateDate: string;
  LocatorType: string;
  LocatorTypeCode: number;
  LocatorTypeDesc: string;
  PickingOrder: number;
  SubInventoryCode: string;
  SubInventoryDesc: string;
  SubinventoryId: number;
  SubinventoryType: string;
  SubinventoryTypeCode: number;
  SubinventoryTypeDesc: string;
}

export interface IWMSResponse {
  ItemNumber_PK: string;
  Locator_PK: string;
  SubInventoryCode_PK: string;
  Lot_PK: string;
  SerialNumber_PK: string;
  LpnNumber_PK: string;
  AssetTag: string;
  ItemDesc: string;
  Uom: string;
  OnhandQty: string;
  ItemId: string;
}

export interface ILocatorsTable {
  InventoryOrgId_PK: string;
  SubInventoryCode: string;
  Locator: string;
  LocatorDesc: string;
  LocatorTypeCode: string;
  LocatorTypeDesc: string;
  LocatorAlias: string;
  LastUpdateDate: string;
  InventoryLocationType: string;
  Flag: string;
  MAXCapacity: string;
}

export interface IOnHandLocators {
  Flag: string;
  InventoryLocationType: string;
  InventoryOrgCode: string;
  InventoryOrgId: string;
  InventoryOrgId_PK: string;
  InventoryOrgName: string;
  ItemDesc: string;
  ItemId_PK: string;
  ItemNumber: string;
  ItemRevision: string;
  LastUpdateDate: string;
  Locator: string;
  LocatorAlias: string;
  LocatorDesc: string;
  LocatorId_PK: string;
  LocatorTypeCode: string;
  LocatorTypeDesc: string;
  Lot_PK: string;
  LpnId_PK: string;
  LpnNumber: string;
  MAXCapacity: string;
  OnhandQty: string;
  PrimaryUom: string;
  RowId: string;
  SecondaryUom: string;
  SerialNumber_PK: string;
  SubInventoryCode: string;
  SubInventoryCode_PK: string;
}

export interface ILocatorWMSFilter {
  AssetTag: string;
  Flag: string;
  InventoryLocationType: string;
  InventoryOrgId_PK: string;
  ItemDesc: string;
  ItemId: string;
  ItemNumber_PK: string;
  LastUpdateDate: string;
  Locator: string;
  LocatorAlias: string;
  LocatorDesc: string;
  LocatorId_PK: string;
  LocatorTypeCode: string;
  LocatorTypeDesc: string;
  Locator_PK: string;
  Lot_PK: string;
  LpnNumber_PK: string;
  MAXCapacity: string;
  OnhandQty: string;
  SerialNumber_PK: string;
  SubInventoryCode: string;
  SubInventoryCode_PK: string;
  Uom: string;
}
