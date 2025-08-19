import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/common-components/header/header.component';
import { SqliteService } from 'src/app/services/sqlite.service';
import { API_TABLE_NAMES, TRASACTION_STATUS } from 'src/app/enums/api-details';
import {
  ICreateReceiptResponse,
  IDataFromTransactionTable,
} from 'src/app/models/create-goods-receipt';
import { TransactionsComponent } from 'src/app/components/transactions/transactions.component';
import { CommunicationService } from 'src/app/services/communication.service';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { Subscription } from 'rxjs';
import { IDocs4ReceivingItems } from 'src/app/models/docs4receiving.interface';
import { NetworkService } from 'src/app/services/network.service';
import { ToastService } from 'src/app/services/toast.service';
import { SearchBarComponent } from 'src/app/components/common-components/search-bar/search-bar.component';
import { SearchFilterPipe } from 'src/app/pipes/search-filter.pipe';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    IonicModule,
    TransactionsComponent,
    SearchBarComponent,
  ],
  providers: [SearchFilterPipe],
})
export class TransactionsPage implements OnInit {
  private sqliteService: SqliteService = inject(SqliteService);
  private commonService: CommunicationService = inject(CommunicationService);
  private apiRequestService: ApiRequestService = inject(ApiRequestService);
  private networkService: NetworkService = inject(NetworkService);
  private toastService: ToastService = inject(ToastService);
  private filterPipe: SearchFilterPipe = inject(SearchFilterPipe);

  transactionsList: IDataFromTransactionTable[] = [];
  filteredTransactionList: IDataFromTransactionTable[] = [];
  subscriptions: Subscription = new Subscription();

  constructor() {}

  ngOnInit() {
    this.initializeTransactionList();
  }

  async initializeTransactionList() {
    try {
      this.transactionsList = await this.sqliteService.getTableRows(
        API_TABLE_NAMES.TRANSACTION_HISTORY
      );
      this.filteredTransactionList = this.transactionsList;
    } catch (err) {
      console.error(err);
    }
  }

  async handleSyncIconClick() {
    try {
      if (!(await this.networkService.isDeviceOnline())) {
        this.toastService.showToast('You are in Offline.', 'bug', 'danger');
        return;
      }
      const transactionsInLocal: IDataFromTransactionTable[] =
        this.transactionsList.filter(
          (transaction) =>
            transaction.transactionStatus === TRASACTION_STATUS.IN_LOCAL
        );
      transactionsInLocal.forEach((transaction) => {
        const createReceiptsBody =
          this.commonService.generateBodyForCreateReceiptApi(transaction);
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
                createReceiptsBody,
                false
              );
            },
            error: (err) => console.error(err),
          });
        this.subscriptions.add(createReceiptSubscription);
      });
    } catch (err) {
      console.error(err);
    }
  }

  handleSearchTextChange(searchTxt: string) {
    this.filteredTransactionList = this.filterPipe.transform(
      this.transactionsList,
      searchTxt
    );
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
