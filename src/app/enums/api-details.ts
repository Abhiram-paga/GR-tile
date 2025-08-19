export enum API_TYPE {
  MASTER = 'master',
  CONFIG = 'config',
  TRANSACTIONAL = 'transactional',
}

export enum API_STATUS {
  SUCCESS = 'success',
  FAILED = 'failed',
  INITIAL = 'initial',
  PENDING = 'pending',
  NO_CONTENT = 'no content',
}

export enum API_RESPONSIBILITY {
  GET_ITEMS = 'GET_ITEMS',
  GET_SERIALS_TABLE_TYPE = 'GET_SERIALS_TABLE_TYPE',
  GET_SUBINVENTORIES = 'GET_SUBINVENTORIES',
  GET_LOCATORS = 'GET_LOCATORS',
  GET_GL_PERIODS = 'GET_GL_PERIODS',
  GET_DOCUMENTS_FOR_RECEIVING = 'GET_DOCUMENTS_FOR_RECEIVING',
  GET_LOTS_TABLE_TYPE = 'GET_LOTS_TABLE_TYPE',
  GET_ON_HAND_TABLE_TYPE = 'GET_ON_HAND_TABLE_TYPE',
  GET_INVENTORY_PERIODS = 'GET_INVENTORY_PERIODS',
  GET_LOCATIONS = 'GET_LOCATION',
  GET_ON_HAND_WMS_FILTER_TABLE = 'GET_ON_HAND_WMS_FILTER_TABLE',
}

export enum API_TABLE_NAMES {
  GET_ITEMS = 'items',
  GET_SERIALS_TABLE_TYPE = 'serials',
  GET_SUBINVENTORIES = 'subInventories',
  GET_LOCATORS = 'locators',
  GET_GL_PERIODS = 'glPeriods',
  GET_DOCUMENTS_FOR_RECEIVING = 'documentsForReceiving',
  GET_LOTS_TABLE_TYPE = 'lotsTable',
  GET_INVENTORY_PERIODS = 'inventoryPeriods',
  GET_LOCATIONS = 'locations',
  GET_ON_HAND_WMS_FILTER_TABLE = 'onHandWMSFilter',
  LOGIN = 'responsibilities',
  GET_ORGANIZATIONS = 'organizationTable',
  GET_ON_HAND_TABLE_TYPE = 'onHandTable',
  TRANSACTION_HISTORY = 'transactions',
}

export enum TRASACTION_STATUS {
  IN_LOCAL = 'local',
  SUCCESS = 'success',
  FAILED = 'failed',
}
