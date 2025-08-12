import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ModalController } from '@ionic/angular';
import { Docs4receivingService } from 'src/app/services/docs4receiving.service';
import { DOC_TYPE, FILTER_SORT_OPTIONS } from 'src/app/enums/docs-4-receiving';
import { addIcons } from 'ionicons';
import { arrowDown, arrowUp, ellipsisVertical, search } from 'ionicons/icons';
import { BackIconComponent } from 'src/app/components/common-components/back-icon/back-icon.component';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { IApiDetails, IApiResponse } from 'src/app/models/api.interface';
import { ResponsibilitiesService } from 'src/app/services/responsibilities.service';
import { API_RESPONSIBILITY, API_STATUS } from 'src/app/enums/api-details';
import { CommunicationService } from 'src/app/services/communication.service';
import { ToastService } from 'src/app/services/toast.service';
import { HOME_PAGE } from 'src/app/constants/home-page';
import { FilterModelComponent } from 'src/app/components/filter-model/filter-model.component';
import { IUniqueDocs } from 'src/app/models/docs4receiving.interface';
import { RefresherComponent } from 'src/app/components/refresher/refresher.component';
import { RefresherCustomEvent } from '@ionic/angular/standalone';
import { ReceiptPurchaseOrderItemComponent } from 'src/app/components/goods-receipt/receipt-purchase-order-item/receipt-purchase-order-item.component';
import { SortModelComponent } from 'src/app/components/sort-model/sort-model.component';
import { SearchBarComponent } from 'src/app/components/common-components/search-bar/search-bar.component';
import { ScanBarComponent } from 'src/app/components/scan-bar/scan-bar.component';

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
    RefresherComponent,
    RefresherComponent,
    ReceiptPurchaseOrderItemComponent,
    SearchBarComponent,
    ScanBarComponent,
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

  selectedSortOption: FILTER_SORT_OPTIONS =
    FILTER_SORT_OPTIONS.LAST_UPDATE_FIRST;
  selectedFilterOption: string = 'ALL';
  filterAndSortOptions: { sortType: FILTER_SORT_OPTIONS }[] = [];
  scanSearchText: string = '';
  isAscOrder: boolean = false;
  isSearchBarShown: boolean = false;

  constructor() {
    addIcons({ ellipsisVertical, arrowUp, arrowDown, search });
  }

  filteredUniqueDocs: IUniqueDocs[] = [];

  async ngOnInit() {
    this.filterAndSortOptions = HOME_PAGE.FILTER_AND_SORT_OPTIONS;
    try {
      await Promise.all([
        this.docs4ReceivingService.getUniqueDocslist(DOC_TYPE.PO_NUMBER),
        this.docs4ReceivingService.getUniqueDocslist(DOC_TYPE.ASN_NUMBER),
        this.docs4ReceivingService.getUniqueDocslist(DOC_TYPE.RMA_NUMBER),
      ]);

      this.filteredUniqueDocs = this.docs4ReceivingService.AllUniqueDocsList;
    } catch (err) {
      console.error(err);
    }
  }

  handleSearchIconClick() {
    this.isSearchBarShown = !this.isSearchBarShown;
  }

  handleArrowClick() {
    this.isAscOrder = !this.isAscOrder;
    this.filteredUniqueDocs = this.sortDocs(
      this.filteredUniqueDocs,
      this.selectedSortOption,
      this.isAscOrder
    );
  }

  applyFilterAndSort() {
    let filteredDocs = this.docs4ReceivingService.AllUniqueDocsList;

    if (this.selectedFilterOption === 'PO') {
      filteredDocs = [...this.docs4ReceivingService.uniquePOlist];
    } else if (this.selectedFilterOption === 'ASN') {
      filteredDocs = [...this.docs4ReceivingService.uniqueASNlist];
    } else if (this.selectedFilterOption === 'RMA') {
      filteredDocs = [...this.docs4ReceivingService.uniqueRMAlist];
    }

    if (this.selectedSortOption === FILTER_SORT_OPTIONS.NEED_BY_DATE) {
      filteredDocs = this.sortDocs(filteredDocs, 'NeedByDate', true);
    } else if (
      this.selectedSortOption === FILTER_SORT_OPTIONS.LAST_UPDATE_FIRST
    ) {
      filteredDocs = this.sortDocs(filteredDocs, 'LastUpdateDate', false);
    }

    this.filteredUniqueDocs = filteredDocs;
    console.log('Filtered + Sorted Docs:', this.filteredUniqueDocs);
  }

  sortDocs(
    docs: IUniqueDocs[],
    sortColumn: keyof IUniqueDocs,
    isSortAsc: boolean = false
  ) {
    const months = {
      JAN: 1,
      FEB: 2,
      MAR: 3,
      APR: 4,
      MAY: 5,
      JUN: 6,
      JUL: 7,
      AUG: 8,
      SEP: 9,
      OCT: 10,
      NOV: 11,
      DEC: 12,
    };

    const formatNeedByDate = (dateString: string): number => {
      if (!dateString) {
        return 0;
      }
      const [day, month, shortYear] = dateString.split('-');
      const monthNumber = months[month.toUpperCase() as keyof typeof months];
      const year = +shortYear < 50 ? 2000 + +shortYear : 1900 + +shortYear; //+ symbol converts string into numbers ,,its a unary operator
      return new Date(`${year}-${monthNumber}-${day}`).getTime();
    };

    const formatDefaultDate = (dateString: string): number => {
      if (!dateString) {
        return 0;
      }
      const [day, month, yearAndTime] = dateString.split('-');
      const [year, time] = yearAndTime.split(' ');
      return new Date(`${year}-${month}-${day} ${time}`).getTime();
    };

    return [...docs].sort((a, b) => {
      let valueA = a[sortColumn];
      let valueB = b[sortColumn];

      if (sortColumn === 'NeedByDate') {
        valueA = formatNeedByDate(valueA as string);
        valueB = formatNeedByDate(valueB as string);
      } else if (sortColumn === 'LastUpdateDate') {
        valueA = formatDefaultDate(valueA as string);
        valueB = formatDefaultDate(valueB as string);
      }

      return isSortAsc
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    });
  }

  handleSearchInputChange(searchText: string) {
    const lowerSearchText = searchText.trim().toLowerCase();

    let filteredDocs = this.docs4ReceivingService.AllUniqueDocsList;

    if (this.selectedFilterOption === 'PO') {
      filteredDocs = [...this.docs4ReceivingService.uniquePOlist];
    } else if (this.selectedFilterOption === 'ASN') {
      filteredDocs = [...this.docs4ReceivingService.uniqueASNlist];
    } else if (this.selectedFilterOption === 'RMA') {
      filteredDocs = [...this.docs4ReceivingService.uniqueRMAlist];
    }

    if (this.selectedSortOption === FILTER_SORT_OPTIONS.NEED_BY_DATE) {
      filteredDocs = this.sortDocs(filteredDocs, 'NeedByDate', true);
    } else if (
      this.selectedSortOption === FILTER_SORT_OPTIONS.LAST_UPDATE_FIRST
    ) {
      filteredDocs = this.sortDocs(filteredDocs, 'LastUpdateDate', false);
    }

    if (lowerSearchText) {
      filteredDocs = filteredDocs.filter(
        (doc) =>
          String(doc.PoNumber).toLowerCase().includes(lowerSearchText) ||
          String(doc.ASNNumber)?.toLowerCase().includes(lowerSearchText) ||
          String(doc.RMANumber)?.toLowerCase().includes(lowerSearchText) ||
          doc.CustomerName.toLowerCase().includes(lowerSearchText) ||
          doc.Requestor.toLowerCase().includes(lowerSearchText) ||
          doc.VendorName.toLowerCase().includes(lowerSearchText)
      );
    }

    this.filteredUniqueDocs = filteredDocs;
  }

  handleDocFound(scanSearchText: string) {
    this.handleSearchInputChange(scanSearchText);
    this.scanSearchText = scanSearchText;

    this.navCtrl.navigateForward('/receipt-items', {
      state: { doc: this.filteredUniqueDocs[0] },
    });
  }

  handlePopoverOptionClick(name: string) {
    const apiDetails: IApiDetails = this.getDocs4ReceivingApiDetails();

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
    } else if (name === 'Sort') {
      this.showSortModal();
    }
  }

  getDocs4ReceivingApiDetails() {
    return this.responsibilitiesService.ALL_API_LIST.filter(
      (api) =>
        api.responsibility === API_RESPONSIBILITY.GET_DOCUMENTS_FOR_RECEIVING
    )[0];
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
      this.selectedFilterOption = data;
      this.applyFilterAndSort();
    } catch (err) {
      console.error(`Error in showing Filter Modal`, err);
    }
  }

  async showSortModal() {
    try {
      const modal = await this.modalController.create({
        component: SortModelComponent,
        componentProps: {
          filterAndSortOptions: this.filterAndSortOptions,
          inpSelectedSortOption: this.selectedSortOption,
        },
      });
      await modal.present();

      const { data } = await modal.onDidDismiss();
      if (data) {
        this.selectedSortOption = data;
      }

      this.applyFilterAndSort();
    } catch (err) {
      console.error(`Error in showing Sort Modal`, err);
    }
  }

  handleRefresh(event: RefresherCustomEvent) {
    const apiDetails: IApiDetails = this.getDocs4ReceivingApiDetails();
    this.generateNewUrlAndHandleApi(apiDetails, true)
      .then(() => {
        event.target.complete();
      })
      .catch((err) => {
        console.error(err);
        event.target.complete();
      });
  }

  handleDocClick(doc: IUniqueDocs) {
    this.navCtrl.navigateForward('/receipt-items', { state: { doc } });
  }

  handleBackIconClick() {
    this.navCtrl.back();
  }
}
