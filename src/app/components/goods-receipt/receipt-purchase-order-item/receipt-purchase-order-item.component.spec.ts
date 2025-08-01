import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReceiptPurchaseOrderItemComponent } from './receipt-purchase-order-item.component';

describe('ReceiptPurchaseOrderItemComponent', () => {
  let component: ReceiptPurchaseOrderItemComponent;
  let fixture: ComponentFixture<ReceiptPurchaseOrderItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptPurchaseOrderItemComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptPurchaseOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
