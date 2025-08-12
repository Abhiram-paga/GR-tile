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

export interface ILocator {
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
