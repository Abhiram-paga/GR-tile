import { FILTER_SORT_OPTIONS } from '../enums/docs-4-receiving';

export const HOME_PAGE = {
  MENU_OPTIONS: [
    {
      name: 'Home',
      iconName: 'home',
    },
    {
      name: 'Refresh On hand Qty',
      iconName: 'refresh',
    },
    {
      name: 'Logout',
      iconName: 'log-out',
    },
    {
      name: 'Logout + Clear Data',
      iconName: 'log-out',
    },
  ],
  POP_OVER_OPTIONS: [
    {
      name: 'Refresh',
      iconName: 'refresh',
    },
    {
      name: 'Reload',
      iconName: 'reload',
    },
    {
      name: 'Filter',
      iconName: 'funnel',
    },
    {
      name: 'Sort',
      iconName: 'swap-vertical',
    },
  ],
  FILTER_OPTIONS: [
    { docType: 'ALL' },
    { docType: 'ASN' },
    { docType: 'PO' },
    { docType: 'RMA' },
  ],
  FILTER_AND_SORT_OPTIONS: [
    { sortType: FILTER_SORT_OPTIONS.LAST_UPDATE_FIRST },
    { sortType: FILTER_SORT_OPTIONS.NEED_BY_DATE },
  ],
};
