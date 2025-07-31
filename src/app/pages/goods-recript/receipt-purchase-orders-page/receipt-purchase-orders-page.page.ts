import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-receipt-purchase-orders-page',
  templateUrl: './receipt-purchase-orders-page.page.html',
  styleUrls: ['./receipt-purchase-orders-page.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ReceiptPurchaseOrdersPagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
