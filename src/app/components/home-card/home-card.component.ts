import { Component, inject, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class HomeCardComponent {
  @Input() responsibilitiesList = [
    { name: 'Goods Receipt' },
    { name: 'PO Inspection' },
  ];
  @Input() openDocs: number = 0;
  completedDocs = 0;

  private navCtrl: NavController = inject(NavController);

  handleClickResponsibility(responsibity: string) {
    if (responsibity === 'Goods Receipt') {
      this.navCtrl.navigateForward('/receipt-purchase-orders-page');
    }
  }

  get percent(): number {
    return this.openDocs === 0
      ? 0
      : Math.round((this.completedDocs / this.openDocs) * 100);
  }
}
