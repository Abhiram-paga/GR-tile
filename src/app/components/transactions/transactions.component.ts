import { Component, Input, OnInit } from '@angular/core';
import { IDataFromTransactionTable } from 'src/app/models/create-goods-receipt';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NoItemsComponent } from "../common-components/no-items/no-items.component";

@Component({
  selector: 'app-transactions-card',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  imports: [IonicModule, CommonModule, NoItemsComponent],
})
export class TransactionsComponent implements OnInit {
  @Input() transactionsList: IDataFromTransactionTable[] = [];
  constructor() {}

  ngOnInit() {}
}
