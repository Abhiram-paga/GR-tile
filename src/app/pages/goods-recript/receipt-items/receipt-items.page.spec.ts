import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceiptItemsPage } from './receipt-items.page';

describe('ReceiptItemsPage', () => {
  let component: ReceiptItemsPage;
  let fixture: ComponentFixture<ReceiptItemsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
