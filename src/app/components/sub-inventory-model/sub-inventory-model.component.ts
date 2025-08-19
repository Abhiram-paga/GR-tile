import { Component, inject, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { BackIconComponent } from '../common-components/back-icon/back-icon.component';
import { CommonModule } from '@angular/common';
import { NoItemsComponent } from '../common-components/no-items/no-items.component';
import { ISubInventory } from 'src/app/models/subinventories.interface';
import { SearchBarComponent } from '../common-components/search-bar/search-bar.component';
import { SearchFilterPipe } from 'src/app/pipes/search-filter.pipe';

@Component({
  selector: 'app-sub-inventory-model',
  templateUrl: './sub-inventory-model.component.html',
  styleUrls: ['./sub-inventory-model.component.scss'],
  imports: [
    IonicModule,
    BackIconComponent,
    CommonModule,
    NoItemsComponent,
    SearchBarComponent,
  ],
  providers: [SearchFilterPipe],
})
export class SubInventoryModelComponent {
  @Input() subInventories: ISubInventory[] = [];

  private modalController: ModalController = inject(ModalController);
  private searchFilterPipe: SearchFilterPipe = inject(SearchFilterPipe);

  filteredSubInventories: any[] = [];

  handleBackIconClick() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    this.filteredSubInventories = this.subInventories;
    console.log(this.subInventories);
  }

  handleSearchInputChanged(searchText: string) {
    this.filteredSubInventories = this.searchFilterPipe.transform(
      this.subInventories,
      searchText
    );
  }

  handleFilterOptionClick(subInventoryCode: string, index: number) {
    this.modalController.dismiss(subInventoryCode);
  }
}
