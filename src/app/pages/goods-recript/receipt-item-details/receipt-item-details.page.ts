import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IDocs4ReceivingItems } from 'src/app/models/docs4receiving.interface';
import { DOC_TYPE } from 'src/app/enums/docs-4-receiving';
import { SqliteService } from 'src/app/services/sqlite.service';
import { HeaderComponent } from 'src/app/components/common-components/header/header.component';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { SlidesComponent } from 'src/app/components/slides/slides.component';
import { ModelLoaderService } from 'src/app/services/model-loader.service';
import { ISubInventory } from 'src/app/models/subinventories.interface';
import { API_TABLE_NAMES, TRASACTION_STATUS } from 'src/app/enums/api-details';
import { SubInventoryModelComponent } from 'src/app/components/sub-inventory-model/sub-inventory-model.component';
import { LocatorsModelComponent } from 'src/app/components/locators-model/locators-model.component';
import { ButtonComponent } from 'src/app/components/common-components/button/button.component';
import { CREATE_GOODS_RECEIPT_METADATA } from 'src/app/constants/create-goods-receipt';
import { ToastService } from 'src/app/services/toast.service';
import { NetworkService } from 'src/app/services/network.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { Subscription } from 'rxjs';
import { ICreateReceiptResponse } from 'src/app/models/create-goods-receipt';

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
  providers: [DatePipe],
})
export class ReceiptItemDetailsPage {
  private router: Router = inject(Router);
  private sqliteService: SqliteService = inject(SqliteService);
  private modalController: ModalController = inject(ModalController);
  private modelLoader: ModelLoaderService = inject(ModelLoaderService);
  private toastService: ToastService = inject(ToastService);
  private netwrokService: NetworkService = inject(NetworkService);
  private commonService: CommunicationService = inject(CommunicationService);
  private apiRequestService: ApiRequestService = inject(ApiRequestService);
  private navController: NavController = inject(NavController);
  private datePipe: DatePipe = inject(DatePipe);

  selectedItem: IDocs4ReceivingItems;
  index: number;
  selectedItemsList: IDocs4ReceivingItems[] = [];
  selectedItemType: DOC_TYPE = DOC_TYPE.PO_NUMBER;
  qtyValue: number | null | string = '';
  subInventoryList: ISubInventory[] = [];
  selectedSubInventory: string = '';
  selectedLocator: string = '';
  selectedUom: string = 'Ea';
  currentActiveItem: IDocs4ReceivingItems;
  enteredCOO: string = '';
  subscriptions = new Subscription();

  constructor() {
    const nav = this.router.getCurrentNavigation();
    this.index = nav?.extras?.state?.['index'];
    this.selectedItemType = nav?.extras?.state?.['selectedItemType'];
    this.selectedItemsList = nav?.extras?.state?.['seletedDocItems'].map(
      (item: IDocs4ReceivingItems) => ({
        ...item,
        qtyValue: '',
      })
    );
    this.selectedItem = this.selectedItemsList[this.index];
    this.currentActiveItem = this.selectedItem;
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

  async handleEnteredQty(value: number, index: number) {
    if (value === 0 || value > +this.selectedItemsList[index].QtyRemaining) {
      const tempQty = value;
      if (
        tempQty + 1 === +this.selectedItemsList[index].QtyRemaining ||
        tempQty - 1 === +this.selectedItemsList[index].QtyRemaining
      ) {
        this.modelLoader
          .presentAlert(
            'Goods Receipt',
            'Qty Tolerance is exceeding. Please click on YES to perform the transaction.'
          )
          .then((modelResult) => {
            if (modelResult === 'confirm') {
              this.selectedItemsList[index].qtyValue = value;
              this.qtyValue = value;
            } else {
              this.selectedItemsList[index].qtyValue = null;
              this.qtyValue = null;
            }
          });
      } else {
        this.modelLoader.presentAlert(
          'Invalid quantity',
          'Entered quantity exceeds remaining quantity.Enter the quantiti below the remaining quantity',
          true
        );
        this.selectedItemsList[index].qtyValue = null;
        this.qtyValue = null;
      }
    } else {
      this.selectedItemsList[this.index].qtyValue = value;
      this.qtyValue = value;
    }
  }

  handleSubInvClick(index: number) {
    this.showSubinventoriesModal(index);
  }

  handleLocClick(index: number) {
    this.showLocatorsModal(index);
  }

  handleChangedItem(currentItem: IDocs4ReceivingItems) {
    this.currentActiveItem = currentItem;
  }

  handleSubInvSelected(subInventoryCode: string, index: number) {
    this.selectedItemsList[index].SubInventoryCode = subInventoryCode;
  }

  handleLocatorSelected(locatorCode: string, index: number) {
    this.selectedItemsList[index].Locator = locatorCode;
  }

  async handleReceiveButtonClick() {
    try {
      if (!this.enteredCOO) {
        this.toastService.showToast('Enter COO', 'bug', 'danger');
        return;
      }
      if (this.qtyValue === 0 || this.qtyValue === null) {
        this.toastService.showToast('Enter Qty', 'bug', 'danger');
        return;
      }
      console.log(this.currentActiveItem);
      let date = new Date();
      let formattedDate = this.datePipe.transform(date, 'dd-MMM-yyyy HH:mm:ss');
      let dataToStoreInTrasactionTable = [
        {
          EmployeeId: localStorage.getItem('employeeId') ?? '',
          BusinessUnitId: localStorage.getItem('businessUnitId') ?? '',
          VendorId: this.currentActiveItem.VendorId,
          InventoryOrgId: localStorage.getItem('selectedInvOrgId') ?? '',
          DeliveryDate: formattedDate ?? '',
          ResponsibilityId: localStorage.getItem('responsibilityId') ?? '',
          UserId: localStorage.getItem('userId') ?? '',
          DummyReceiptNumber: date.getTime().toString(),
          BusinessUnit: '',
          MobileTransactionId: date.getTime().toString(),
          TransactionType: 'RECEIVE',
          AutoTransactCode: 'RECEIVE',
          DocumentNumber:
            this.currentActiveItem[this.selectedItemType].toString(),
          DocumentLineNumber: (
            this.selectedItemsList.findIndex(
              (item) => item.ItemNumber === this.currentActiveItem.ItemNumber
            ) + 1
          ).toString(),
          ItemNumber: this.currentActiveItem.ItemNumber,
          TransactionDate: formattedDate ?? '',
          Quantity: this.currentActiveItem.qtyValue?.toString(),
          UnitOfMeasure: this.currentActiveItem.ItemUom,
          POHeaderId: this.currentActiveItem.PoHeaderId,
          POLineLocationId: this.currentActiveItem.PoLineLocationId,
          POLineId: this.currentActiveItem.PoLineId,
          PODistributionId: this.currentActiveItem.PoDistributionId,
          DestinationTypeCode: 'Receiving',
          isSynced: String(false),
          syncedTime: '',
          Subinventory: this.currentActiveItem['SubInventoryCode'],
          Locator: this.currentActiveItem['Locator'],
          transactionStatus: TRASACTION_STATUS.IN_LOCAL,
          transactionTile: 'Good Receipt',
        },
      ];

      // await this.sqliteService.dropTable(API_TABLE_NAMES.TRANSACTION_HISTORY);
      // await this.sqliteService.deleteAllRows(
      //   API_TABLE_NAMES.TRANSACTION_HISTORY
      // );

      await this.sqliteService.insertValuesToTable(
        API_TABLE_NAMES.TRANSACTION_HISTORY,
        dataToStoreInTrasactionTable,
        CREATE_GOODS_RECEIPT_METADATA
      );

      const transactions = await this.sqliteService.getTableRows(
        API_TABLE_NAMES.TRANSACTION_HISTORY
      );
      console.log(transactions);
      const createReceiptsBody =
        this.commonService.generateBodyForCreateReceiptApi(
          dataToStoreInTrasactionTable[0]
        );
      if (await this.netwrokService.isDeviceOnline()) {
        const createReceiptSubscription = this.apiRequestService
          .request<ICreateReceiptResponse>(
            'POST',
            '/EBS/20D/createGoodsReceiptTransactions',
            createReceiptsBody
          )
          .subscribe({
            next: async (res) => {
              console.log(res);
              this.commonService.handleCreateReceiptsApiResponse(
                res,
                createReceiptsBody
              );
              await this.sqliteService.updateRemainingQty(
                this.currentActiveItem.ItemNumber,
                +this.currentActiveItem.QtyRemaining -
                  +this.currentActiveItem.qtyValue!
              );
            },
            error: (err) => console.error(err),
          });
        this.subscriptions.add(createReceiptSubscription);
      } else {
        this.sqliteService.updateColumnValueOfRow(
          API_TABLE_NAMES.TRANSACTION_HISTORY,
          'isSynced',
          'transactionStatus',
          'false',
          TRASACTION_STATUS.IN_LOCAL,
          'MobileTransactionId',
          String(
            createReceiptsBody.Input.parts[0].payload.lines[0]
              .MobileTransactionId
          )
        );

        await this.sqliteService.updateRemainingQty(
          this.currentActiveItem.ItemNumber,
          +this.currentActiveItem.QtyRemaining -
            +this.currentActiveItem.qtyValue!
        );

        this.toastService.showToast('Stored in Local', 'success', 'medium');
        this.navController.navigateForward('/receipt-items');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async showSubinventoriesModal(index: number) {
    try {
      const modal = await this.modalController.create({
        component: SubInventoryModelComponent,
        componentProps: {
          subInventories: this.subInventoryList,
        },
      });
      await modal.present();

      const { data } = await modal.onDidDismiss();
      console.log(data);
      if (data !== undefined) {
        this.selectedSubInventory = data;
        this.handleSubInvSelected(data, index);
      }
      console.log(this.selectedSubInventory);
    } catch (err) {
      console.error(`Error in showing Sort Modal`, err);
    }
  }
  async showLocatorsModal(index: number) {
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
        this.handleLocatorSelected(data, index);
      }
    } catch (err) {
      console.error(`Error in showing Sort Modal`, err);
    }
  }

  handleChangeCOO(enteredCOO: string) {
    this.enteredCOO = enteredCOO;
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
