import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IDocs4ReceivingItems } from 'src/app/models/docs4receiving.interface';
import { DOC_TYPE } from 'src/app/enums/docs-4-receiving';
import { SqliteService } from 'src/app/services/sqlite.service';
import { HeaderComponent } from 'src/app/components/common-components/header/header.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { SlidesComponent } from 'src/app/components/slides/slides.component';
import { ModelLoaderService } from 'src/app/services/model-loader.service';
import { ISubInventory } from 'src/app/models/subinventories.interface';
import { API_TABLE_NAMES } from 'src/app/enums/api-details';
import { SubInventoryModelComponent } from 'src/app/components/sub-inventory-model/sub-inventory-model.component';
import { LocatorsModelComponent } from 'src/app/components/locators-model/locators-model.component';
import { ButtonComponent } from 'src/app/components/common-components/button/button.component';

@Component({
  selector: 'app-receipt-item-details',
  templateUrl: './receipt-item-details.page.html',
  styleUrls: ['./receipt-item-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HeaderComponent,
    SlidesComponent,
    ButtonComponent,
  ],
})
export class ReceiptItemDetailsPage {
  private router: Router = inject(Router);
  private sqliteService: SqliteService = inject(SqliteService);
  private modalController: ModalController = inject(ModalController);
  private modelLoader: ModelLoaderService = inject(ModelLoaderService);

  selectedItem: IDocs4ReceivingItems;
  index: number;
  selectedItemsList: IDocs4ReceivingItems[] = [];
  selectedItemType: DOC_TYPE = DOC_TYPE.PO_NUMBER;
  qtyValue: number | null | string = '';
  subInventoryList: ISubInventory[] = [];
  selectedSubInventory: string = '';
  selectedLocator: string = '';
  selectedUom: string = 'Ea';
  currentActiveItem: IDocs4ReceivingItems;;
  enteredCOO: string = '';

  constructor() {
    const nav = this.router.getCurrentNavigation();
    this.index = nav?.extras?.state?.['index'];
    this.selectedItemType = nav?.extras?.state?.['selectedItemType'];
    this.selectedItemsList = nav?.extras?.state?.['seletedDocItems'];
    this.selectedItem = this.selectedItemsList[this.index];
    this.currentActiveItem=this.selectedItem
  }

  ngOnInit() {
    this.initializeSubInventoryList();
  }

  async initializeSubInventoryList() {
    try {
      this.subInventoryList = await this.sqliteService.getTableRowsWithOrderBy(
        API_TABLE_NAMES.GET_SUBINVENTORIES,
        'SubInventoryCode'
      );
    } catch (err) {
      console.error(err);
    }
  }

  async handleEnteredQty(value: number) {
    console.log(value);
    if (value === 0 || value > +this.selectedItem.QtyRemaining) {
      const modelResult = await this.modelLoader.presentAlert(
        'Goods Receipt',
        'Qty Tolerance is exceeding. Please click on YES to perform the transaction.'
      );
      console.log(modelResult);
      if (modelResult === 'confirm') {
        this.qtyValue = value;
      } else {
        this.qtyValue = null;
      }
    }
  }

  handleSubInvClick() {
    this.showSubinventoriesModal();
  }

  handleLocClick() {
    this.showLocatorsModal();
  }

  handleChangedItem(currentItem: IDocs4ReceivingItems) {
    this.currentActiveItem = currentItem;
  }

  handleReceiveButtonClick() {
    console.log('COO', this.enteredCOO);
    console.log('SubInv', this.selectedSubInventory);
    console.log('Locator', this.selectedLocator);
    console.log(this.currentActiveItem);
  }

  async showSubinventoriesModal() {
    try {
      const modal = await this.modalController.create({
        component: SubInventoryModelComponent,
        componentProps: {
          subInventories: this.subInventoryList,
        },
      });
      await modal.present();

      const { data } = await modal.onDidDismiss();
      if (data !== undefined) {
        this.selectedSubInventory = data;
      }
      console.log(this.selectedSubInventory);
    } catch (err) {
      console.error(`Error in showing Sort Modal`, err);
    }
  }
  async showLocatorsModal() {
    try {
      const modal = await this.modalController.create({
        component: LocatorsModelComponent,
        componentProps: {
          selectedSubInventory: this.selectedSubInventory,
          selectedItem: this.selectedItem,
        },
      });
      await modal.present();

      const { data } = await modal.onDidDismiss();
      if (data !== undefined) {
        this.selectedLocator = data;
      }
    } catch (err) {
      console.error(`Error in showing Sort Modal`, err);
    }
  }

  handleChangeCOO(enteredCOO: string) {
    this.enteredCOO = enteredCOO;
  }
}
