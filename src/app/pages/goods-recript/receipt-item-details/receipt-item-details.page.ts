import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IDocs4ReceivingItems } from 'src/app/models/docs4receiving.interface';
import { Docs4receivingService } from 'src/app/services/docs4receiving.service';
import { DOC_TYPE } from 'src/app/enums/docs-4-receiving';
import { SqliteService } from 'src/app/services/sqlite.service';
import { HeaderComponent } from 'src/app/components/common-components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { SlidesComponent } from 'src/app/components/slides/slides.component';
import { ModelLoaderService } from 'src/app/services/model-loader.service';

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
  ],
})
export class ReceiptItemDetailsPage implements OnInit {
  private router: Router = inject(Router);
  private docs4ReceivingService: Docs4receivingService = inject(
    Docs4receivingService
  );
  private sqliteService: SqliteService = inject(SqliteService);
  private modelLoader: ModelLoaderService = inject(ModelLoaderService);

  selectedItem: IDocs4ReceivingItems;
  index: number;
  selectedItemsList: IDocs4ReceivingItems[] = [];
  selectedItemType: DOC_TYPE = DOC_TYPE.PO_NUMBER;
  qtyValue: number | null = null;

  constructor() {
    const nav = this.router.getCurrentNavigation();
    this.index = nav?.extras?.state?.['index'];
    this.selectedItemType = nav?.extras?.state?.['selectedItemType'];
    this.selectedItemsList = nav?.extras?.state?.['seletedDocItems'];
    this.selectedItem = this.selectedItemsList[this.index];
    // localStorage.setItem('selectedDoc', JSON.stringify(this.selectedItem));
  }

  ngOnInit() {
    // this.initializeSelectedItemsList();
  }

  async handleEnteredQty(value: number) {
    console.log(value)
    if (value === 0 || value > +this.selectedItem.QtyRemaining) {
      const modelResult = await this.modelLoader.presentAlert(
        'Goods Receipt',
        'Qty Tolerance is exceeding. Please click on YES to perform the transaction.'
      );
      if (modelResult === 'cancel') {
        this.qtyValue = null;
      }else{
        this.qtyValue=value;
      }
    }
  }

  // async initializeSelectedItemsList() {
  //   const stringifiedDoc = localStorage.getItem('selectedItem');
  //   if (stringifiedDoc) {
  //     this.selectedItem = JSON.parse(stringifiedDoc);
  //   }

  //   if (this.selectedItem.PoNumber) {
  //     this.selectedItemType = DOC_TYPE.PO_NUMBER;
  //     this.selectedItemsList = await this.docs4ReceivingService.getPoItems(
  //       this.selectedItem.PoNumber,
  //       this.selectedItemType
  //     );
  //   } else if (this.selectedItem.ASNNumber) {
  //     this.selectedItemType = DOC_TYPE.ASN_NUMBER;
  //     this.selectedItemsList = await this.sqliteService.getDocItems(
  //       this.selectedItem.ASNNumber,
  //       DOC_TYPE.ASN_NUMBER
  //     );
  //   } else if (this.selectedItem.RMANumber) {
  //     this.selectedItemType = DOC_TYPE.RMA_NUMBER;
  //     this.selectedItemsList = await this.sqliteService.getDocItems(
  //       this.selectedItem.RMANumber,
  //       DOC_TYPE.RMA_NUMBER
  //     );
  //   }
  //   console.log(this.selectedItemsList);
  // }
}
