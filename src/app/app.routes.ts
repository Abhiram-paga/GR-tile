import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'organizations',
    loadComponent: () => import('./pages/organizations/organizations.page').then( m => m.OrganizationsPage)
  },
  {
    path: 'activity',
    loadComponent: () => import('./pages/activity/activity.page').then( m => m.ActivityPage)
  },
  {
    path: 'receipt-purchase-orders-page',
    loadComponent: () => import('./pages/goods-recript/receipt-purchase-orders-page/receipt-purchase-orders-page.page').then( m => m.ReceiptPurchaseOrdersPagePage)
  },

];
