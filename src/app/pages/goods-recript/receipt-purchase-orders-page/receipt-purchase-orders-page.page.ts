import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ModalController } from '@ionic/angular';
import { Docs4receivingService } from 'src/app/services/docs4receiving.service';
import { DOC_TYPE } from 'src/app/enums/docs-4-receiving';
import { addIcons } from 'ionicons';
import { ellipsisVertical } from 'ionicons/icons';
import { BackIconComponent } from 'src/app/components/common-components/back-icon/back-icon.component';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { IApiDetails, IApiResponse } from 'src/app/models/api.interface';
import { ResponsibilitiesService } from 'src/app/services/responsibilities.service';
import { API_RESPONSIBILITY, API_STATUS } from 'src/app/enums/api-details';
import { CommunicationService } from 'src/app/services/communication.service';
import { ToastService } from 'src/app/services/toast.service';
import { HOME_PAGE } from 'src/app/constants/home-page';
import { FilterModelComponent } from 'src/app/components/filter-model/filter-model.component';
import { IuniqueDocs } from 'src/app/models/docs4receiving.interface';
import { RefresherComponent } from 'src/app/components/refresher/refresher.component';
import { RefresherCustomEvent } from '@ionic/angular/standalone';
import { ReceiptPurchaseOrderItemComponent } from "src/app/components/goods-receipt/receipt-purchase-order-item/receipt-purchase-order-item.component";

@Component({
  selector: 'app-receipt-purchase-orders-page',
  templateUrl: './receipt-purchase-orders-page.page.html',
  styleUrls: ['./receipt-purchase-orders-page.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BackIconComponent,
    PopoverComponent,
    FilterModelComponent,
    RefresherComponent,
    RefresherComponent,
    ReceiptPurchaseOrderItemComponent
],
})
export class ReceiptPurchaseOrdersPagePage implements OnInit {
  private docs4ReceivingService: Docs4receivingService = inject(
    Docs4receivingService
  );
  private responsibilitiesService: ResponsibilitiesService = inject(
    ResponsibilitiesService
  );
  private commonService: CommunicationService = inject(CommunicationService);
  private toastService: ToastService = inject(ToastService);
  private navCtrl: NavController = inject(NavController);
  private modalController: ModalController = inject(ModalController);

  constructor() {
    addIcons({ ellipsisVertical });
  }

  filteredUniqueDocs: IuniqueDocs[] = [];

  ngOnInit() {
    this.docs4ReceivingService.getUniqueDocslist(DOC_TYPE.PO_NUMBER);
    this.docs4ReceivingService.getUniqueDocslist(DOC_TYPE.ASN_NUMBER);
    this.docs4ReceivingService.getUniqueDocslist(DOC_TYPE.RMA_NUMBER);

    this.filteredUniqueDocs = this.docs4ReceivingService.AllUniqueDocsList;
  }

  getfilterUniqueDocs(docType: string) {
    const allDocs = this.docs4ReceivingService.AllUniqueDocsList;

    if (docType === 'ALL') {
      return allDocs;
    } else if (docType === 'PO') {
      return allDocs.filter((doc) => doc.PoNumber);
    } else if (docType === 'ASN') {
      return allDocs.filter((doc) => doc.ASNNumber);
    } else if (docType === 'RMA') {
      return allDocs.filter((doc) => doc.RMANumber);
    } else {
      return [];
    }
  }

  handlePopoverOptionClick(name: string) {
    const apiDetails: IApiDetails =
      this.responsibilitiesService.ALL_API_LIST.filter(
        (api) =>
          api.responsibility === API_RESPONSIBILITY.GET_DOCUMENTS_FOR_RECEIVING
      )[0];
    if (name === 'Refresh') {
      this.toastService.showToast(
        'Refreshing Goods Receipt data',
        'refresh',
        'medium'
      );
      this.generateNewUrlAndHandleApi(apiDetails, true);
    } else if (name === 'Reload') {
      this.toastService.showToast(
        'Reloading Goods Receipt data',
        'reload',
        'medium'
      );
      this.generateNewUrlAndHandleApi(apiDetails, false);
    } else if (name === 'Filter') {
      this.showFilterModel();
    }
  }

  async generateNewUrlAndHandleApi(
    apiDetails: IApiDetails,
    isRefresh: boolean
  ) {
    try {
      if (!isRefresh) {
        const apiResponse: IApiResponse =
          await this.commonService.handleApiResponse({
            ...apiDetails,
            apiStatus: API_STATUS.INITIAL,
          });
        if (apiResponse.statusCode === 200) {
          this.toastService.showToast(
            'Reloading Goods Receipt data:Sucess',
            'reload',
            'success'
          );
        } else {
          this.toastService.showToast(
            'Reloading Goods Receipt data:Failed',
            'reload',
            'danger'
          );
        }
      }
      const urlParts = apiDetails.apiUrl.split('/');
      urlParts.pop();
      urlParts.pop();
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = now.toLocaleString('default', { month: 'short' });
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const dateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
      urlParts.push(encodeURIComponent(dateTime));
      urlParts.push('%22Y%22');
      const newApi = {
        ...apiDetails,
        apiStatus: API_STATUS.INITIAL,
        apiUrl: urlParts.join('/'),
      };
      const apiResponse: IApiResponse =
        await this.commonService.handleApiResponse(newApi);
      if (apiResponse.statusCode === 200) {
        this.toastService.showToast(
          'Refreshing Goods Receipt data:Sucess',
          'reload',
          'success'
        );
      } else {
        this.toastService.showToast(
          'Refreshin Goods Receipt data:Failed',
          'reload',
          'danger'
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async showFilterModel() {
    try {
      const modal = await this.modalController.create({
        component: FilterModelComponent,
        componentProps: {
          filterOptions: HOME_PAGE.FILTER_OPTIONS,
        },
      });
      await modal.present();

      const { data } = await modal.onDidDismiss();
      this.filteredUniqueDocs = this.getfilterUniqueDocs(data);
      console.log(this.filteredUniqueDocs);
    } catch (err) {
      console.error(`Error in showing Filter Modal`, err);
    }
  }

  handleRefresh(event: RefresherCustomEvent) {
    event.target.complete();
  }

  handleBackIconClick() {
    this.navCtrl.back();
  }
}
