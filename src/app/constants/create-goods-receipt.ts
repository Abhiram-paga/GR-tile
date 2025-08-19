import { IMetadata } from '../models/user.interface';

export const CREATE_GOODS_RECEIPT_METADATA: IMetadata[] = [
  {
    name: 'EmployeeId',
    type: 'TEXT',
  },
  {
    name: 'BusinessUnitId',
    type: 'TEXT',
  },
  {
    name: 'VendorId',
    type: 'TEXT',
  },
  {
    name: 'InventoryOrgId',
    type: 'TEXT',
  },
  {
    name: 'DeliveryDate',
    type: 'TEXT',
  },
  {
    name: 'ResponsibilityId',
    type: 'TEXT',
  },
  {
    name: 'UserId',
    type: 'TEXT',
  },
  {
    name: 'DummyReceiptNumber',
    type: 'TEXT',
  },
  {
    name: 'BusinessUnit',
    type: 'TEXT',
  },
  {
    name: 'MobileTransactionId',
    type: 'TEXT',
    primarykey: true,
  },
  {
    name: 'TransactionType',
    type: 'TEXT',
  },
  {
    name: 'AutoTransactCode',
    type: 'TEXT',
  },
  {
    name: 'DocumentNumber',
    type: 'TEXT',
  },
  {
    name: 'DocumentLineNumber',
    type: 'TEXT',
  },
  {
    name: 'ItemNumber',
    type: 'TEXT',
  },
  {
    name: 'TransactionDate',
    type: 'TEXT',
  },
  {
    name: 'Quantity',
    type: 'TEXT',
  },
  {
    name: 'UnitOfMeasure',
    type: 'TEXT',
  },
  {
    name: 'POHeaderId',
    type: 'TEXT',
  },
  {
    name: 'POLineLocationId',
    type: 'TEXT',
  },
  {
    name: 'POLineId',
    type: 'TEXT',
  },
  {
    name: 'PODistributionId',
    type: 'TEXT',
  },
  {
    name: 'DestinationTypeCode',
    type: 'TEXT',
  },
  {
    name: 'isSynced',
    type: 'TEXT',
  },
  {
    name: 'syncedTime',
    type: 'TEXT',
  },
  {
    name: 'Subinventory',
    type: 'TEXT',
  },
  {
    name: 'Locator',
    type: 'TEXT',
  },
  {
    name: 'transactionStatus',
    type: 'TEXT',
  },
  {
    name: 'transactionTile',
    type: 'TEXT',
  },
];
