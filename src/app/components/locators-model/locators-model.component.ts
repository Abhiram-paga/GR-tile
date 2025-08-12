import { Component, inject, Input, OnInit } from '@angular/core';
import { IDocs4ReceivingItems } from 'src/app/models/docs4receiving.interface';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { NoItemsComponent } from '../common-components/no-items/no-items.component';
import { BackIconComponent } from '../common-components/back-icon/back-icon.component';
import { SearchBarComponent } from '../common-components/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SearchFilterPipe } from 'src/app/pipes/search-filter.pipe';
import { ILocatorWMSFilter } from 'src/app/models/subinventories.interface';
import { SqliteService } from 'src/app/services/sqlite.service';
import { API_TABLE_NAMES } from 'src/app/enums/api-details';
import { JOINS } from 'src/app/enums/query';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-locators-model',
  templateUrl: './locators-model.component.html',
  styleUrls: ['./locators-model.component.scss'],
  imports: [
    IonicModule,
    NoItemsComponent,
    BackIconComponent,
    SearchBarComponent,
    CommonModule,
  ],
  providers: [SearchFilterPipe],
})
export class LocatorsModelComponent implements OnInit {
  @Input() selectedItem: IDocs4ReceivingItems | undefined;
  @Input() selectedSubInventory: string = '';

  locatorsList: ILocatorWMSFilter[] = [];
  filteredLocatorsList: ILocatorWMSFilter[] = [];
  isDataFetched: boolean = false;

  subscription: Subscription = new Subscription();

  private apiResquestService: ApiRequestService = inject(ApiRequestService);
  private commonService: CommunicationService = inject(CommunicationService);
  private modalController: ModalController = inject(ModalController);
  private searchFilterPipe: SearchFilterPipe = inject(SearchFilterPipe);
  private sqliteService: SqliteService = inject(SqliteService);
  private toastController: ToastService = inject(ToastService);

  constructor() {}

  ngOnInit() {
    this.initializeLocators();
  }

  async initializeLocators() {
    try {
      const subscription1 = this.apiResquestService
        .request(
          'GET',
          `/EBS/22C/getOnHandWMSFilterTableType/${localStorage.getItem(
            'selectedInvOrgId'
          )}/${this.selectedSubInventory}/''/${this.selectedItem?.ItemNumber}`
        )
        .subscribe({
          next: async (res) => {
            let jsonRes = this.commonService.convertCsvToJson(res);
            let metaData = this.commonService.getMetaDataForJson(jsonRes);
            await this.sqliteService.createTable(
              metaData,
              API_TABLE_NAMES.GET_ON_HAND_WMS_FILTER_TABLE
            );
            await this.sqliteService.insertValuesToTable(
              API_TABLE_NAMES.GET_ON_HAND_WMS_FILTER_TABLE,
              jsonRes,
              metaData
            );
            await this.sqliteService.getTableRows(
              API_TABLE_NAMES.GET_ON_HAND_WMS_FILTER_TABLE
            );
            await this.sqliteService.getTableRows(API_TABLE_NAMES.GET_LOCATORS);
            this.locatorsList =
              await this.sqliteService.getJoinedRowsOfTwoTables(
                API_TABLE_NAMES.GET_ON_HAND_WMS_FILTER_TABLE,
                API_TABLE_NAMES.GET_LOCATORS,
                JOINS.INNER_Join,
                'Locator_PK',
                'Locator'
              );
            this.filteredLocatorsList = this.locatorsList;
            this.isDataFetched = true;
            console.log(this.filteredLocatorsList);
          },
          error: (err) => {
            console.error('Error in OnHandWMSFilter Api:', err);
            this.toastController.showToast(
              'Please select subInv',
              'bug',
              'danger'
            );
          },
        });
      this.subscription.add(subscription1);
    } catch (err) {
      console.error(err);
    }
  }

  handleBackIconClick() {
    this.modalController.dismiss();
  }

  handleSearchInputChanged(searchText: string) {
    this.filteredLocatorsList = this.searchFilterPipe.transform(
      this.locatorsList,
      searchText
    );
  }

  handleFilterOptionClick(selectedLocator: string) {
    this.modalController.dismiss(selectedLocator);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
