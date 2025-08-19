// export interface ICreateReceipt {
//   Input: Input;
// }

import { TRASACTION_STATUS } from '../enums/api-details';

// export interface Input {
//   parts: Part[];
// }

// export interface Part {
//   id: string;
//   path: string;
//   operation: string;
//   payload: Payload;
// }

// export interface Payload {
//   ReceiptSourceCode: string;
//   OrganizationCode: string;
//   EmployeeId: string;
//   BusinessUnitId: string;
//   ReceiptNumber: string;
//   BillOfLading: string;
//   FreightCarrierName: string;
//   PackingSlip: string;
//   WaybillAirbillNumber: string;
//   ShipmentNumber: string;
//   ShippedDate: string;
//   VendorSiteId: string;
//   VendorId: number;
//   attachments: any[];
//   CustomerId: string;
//   InventoryOrgId: string;
//   DeliveryDate: string;
//   ResponsibilityId: string;
//   UserId: string;
//   DummyReceiptNumber: string;
//   BusinessUnit: string;
//   InsertAndProcessFlag: string;
//   lines: Line[];
// }

// export interface Line {
//   ReceiptSourceCode: string;
//   MobileTransactionId: number;
//   TransactionType: string;
//   AutoTransactCode: string;
//   OrganizationCode: string;
//   DocumentNumber: string;
//   DocumentLineNumber: string;
//   ItemNumber: string;
//   TransactionDate: string;
//   Quantity: string;
//   UnitOfMeasure: string;
//   SoldtoLegalEntity: string;
//   SecondaryUnitOfMeasure: string;
//   ShipmentHeaderId: string;
//   ItemRevision: string;
//   POHeaderId: number;
//   POLineLocationId: number;
//   POLineId: number;
//   PODistributionId: number;
//   ReasonName: string;
//   Comments: string;
//   ShipmentLineId: string;
//   transactionAttachments: any[];
//   lotItemLots: any[];
//   serialItemSerials: any[];
//   lotSerialItemLots: any[];
//   ExternalSystemTransactionReference: string;
//   ReceiptAdviceHeaderId: string;
//   ReceiptAdviceLineId: string;
//   TransferOrderHeaderId: string;
//   TransferOrderLineId: string;
//   PoLineLocationId: string;
//   DestinationTypeCode: string;
//   Subinventory: string;
//   Locator: string;
//   ShipmentNumber: string;
//   LpnNumber: string;
//   OrderLineId: string;
// }

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
