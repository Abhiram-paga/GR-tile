import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceiptItemDetailsPage } from './receipt-item-details.page';

describe('ReceiptItemDetailsPage', () => {
  let component: ReceiptItemDetailsPage;
  let fixture: ComponentFixture<ReceiptItemDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptItemDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
