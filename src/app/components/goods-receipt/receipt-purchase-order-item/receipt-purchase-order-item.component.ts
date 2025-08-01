import { Component, Input} from '@angular/core';
import { IuniqueDocs } from 'src/app/models/docs4receiving.interface';

@Component({
  selector: 'app-receipt-purchase-order-item',
  templateUrl: './receipt-purchase-order-item.component.html',
  styleUrls: ['./receipt-purchase-order-item.component.scss'],
})
export class ReceiptPurchaseOrderItemComponent  {
  @Input() uniqueDocs:IuniqueDocs[]=[];

}
