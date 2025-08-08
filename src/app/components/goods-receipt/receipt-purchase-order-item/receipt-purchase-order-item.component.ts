import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUniqueDocs } from 'src/app/models/docs4receiving.interface';
import { IonicModule } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NoItemsComponent } from '../../common-components/no-items/no-items.component';

@Component({
  selector: 'app-receipt-purchase-order-item',
  templateUrl: './receipt-purchase-order-item.component.html',
  styleUrls: ['./receipt-purchase-order-item.component.scss'],
  imports: [IonicModule, ScrollingModule, CommonModule, NoItemsComponent],
})
export class ReceiptPurchaseOrderItemComponent {
  @Input() uniqueDocs: IUniqueDocs[] = [];
  @Output() clickedDoc = new EventEmitter();

  changeFormateOfDate(inputDate: string) {
    const [day, month, year] = inputDate.split(' ')[0].split('-');
    const months: string[] = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const newDate = `${day}-${months[parseInt(month) - 1]}-${year}`;
    return newDate;
  }

  handleDocClick(event: IUniqueDocs) {
    this.clickedDoc.emit(event);
  }
}
