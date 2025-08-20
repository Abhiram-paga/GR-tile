import { TRASACTION_STATUS } from '../enums/api-details';

export interface IDataFromTransactionTable {
  EmployeeId: string;
  BusinessUnitId: string;
  VendorId: string;
  InventoryOrgId: string;
  DeliveryDate: string;
  ResponsibilityId: string;
  UserId: string;
  DummyReceiptNumber: string;
  BusinessUnit: string;
  MobileTransactionId: string;
  TransactionType: string;
  AutoTransactCode: string;
  DocumentNumber: string;
  DocumentLineNumber: string;
  ItemNumber: string;
  TransactionDate: string;
  Quantity: string | undefined;
  UnitOfMeasure: string;
  POHeaderId: string;
  POLineLocationId: string;
  POLineId: string;
  PODistributionId: string;
  DestinationTypeCode: string;
  isSynced: string;
  syncedTime: string;
  Subinventory: string;
  Locator: string;
  transactionStatus: TRASACTION_STATUS;
  transactionTile: string;
}

export interface ICreateReceiptResponse {
  Response: IResponse[];
  Success: boolean;
}

export interface IResponse {
  MobileTransactionId: string;
  PoLineLocationId: string;
  PoHeaderId: string;
  ReceiptNumber: string;
  ShipmentHeaderId: string;
  ShipmentLineId: string;
  OrderLineId: string;
  TransactionId: string;
  RecordStatus: string;
  Message: string;
}
