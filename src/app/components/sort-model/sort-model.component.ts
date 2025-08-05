import { Component, inject, Input } from '@angular/core';
import { FILTER_SORT_OPTIONS } from 'src/app/enums/docs-4-receiving';
import { IonicModule, ModalController } from '@ionic/angular';
import { BackIconComponent } from '../common-components/back-icon/back-icon.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../common-components/button/button.component';

@Component({
  selector: 'app-sort-model',
  templateUrl: './sort-model.component.html',
  styleUrls: ['./sort-model.component.scss'],
  imports: [IonicModule, BackIconComponent, CommonModule, ButtonComponent],
})
export class SortModelComponent {
  private modalController: ModalController = inject(ModalController);

  @Input() filterAndSortOptions: { sortType: FILTER_SORT_OPTIONS }[] = [];
  @Input() inpSelectedSortOption: FILTER_SORT_OPTIONS | '' =
    FILTER_SORT_OPTIONS.LAST_UPDATE_FIRST;

  handleBackIconClick() {
    this.modalController.dismiss();
  }

  handleApplyClick() {
    this.modalController.dismiss(this.inpSelectedSortOption);
  }

  handleResetClick() {
    this.inpSelectedSortOption='';
  }

  handleSortOptionClick(seletedSortOption: FILTER_SORT_OPTIONS) {
    this.inpSelectedSortOption = seletedSortOption;
  }
}
