import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceiptPurchaseOrdersPagePage } from './receipt-purchase-orders-page.page';

describe('ReceiptPurchaseOrdersPagePage', () => {
  let component: ReceiptPurchaseOrdersPagePage;
  let fixture: ComponentFixture<ReceiptPurchaseOrdersPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptPurchaseOrdersPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
