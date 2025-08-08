import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDocs4ReceivingItems } from 'src/app/models/docs4receiving.interface';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { chevronForward } from 'ionicons/icons';

@Component({
  selector: 'app-receipt-each-item',
  templateUrl: './receipt-each-item.component.html',
  styleUrls: ['./receipt-each-item.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class ReceiptEachItemComponent {
  @Input() itemsList: IDocs4ReceivingItems[] = [];
  @Output() itemClicked = new EventEmitter();

  constructor() {
    addIcons({
      chevronForward,
    });
  }

  handleForwardIconClick(index:number) {
    this.itemClicked.emit(index);
  }
}
