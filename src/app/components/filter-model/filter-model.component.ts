import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { BackIconComponent } from '../common-components/back-icon/back-icon.component';

@Component({
  selector: 'app-filter-model',
  templateUrl: './filter-model.component.html',
  styleUrls: ['./filter-model.component.scss'],
  imports: [IonicModule, CommonModule, BackIconComponent],
})
export class FilterModelComponent {
  private modalController: ModalController = inject(ModalController);
  private navController: NavController = inject(NavController);
  @Input() filterOptions: { docType: string }[] = [];

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  handleBackIconClick() {
    this.modalController.dismiss();
  }

  handleFilterOptionClick(docType: string) {
    this.modalController.dismiss(docType);
  }
}
