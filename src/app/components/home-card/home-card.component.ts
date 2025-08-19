import { Component, inject, Input } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { listOutline, receiptOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class HomeCardComponent {
  @Input() responsibilitiesList = [
    { name: 'Goods Receipt', iconName: 'receipt-outline' },
    { name: 'Transactions', iconName: 'list-outline' },
  ];
  @Input() openDocs: number = 0;
  completedDocs = 0;

  constructor() {
    addIcons({ listOutline, receiptOutline });
  }

  private navCtrl: NavController = inject(NavController);

  handleClickResponsibility(responsibity: string) {
    if (responsibity === 'Goods Receipt') {
      this.navCtrl.navigateForward('/receipt-purchase-orders-page');
    } else if (responsibity === 'Transactions') {
      this.navCtrl.navigateForward('/transactions');
    }
  }
}
