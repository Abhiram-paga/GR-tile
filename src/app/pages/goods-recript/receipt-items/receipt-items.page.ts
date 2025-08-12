import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  IDocs4ReceivingItems,
  IUniqueDocs,
} from 'src/app/models/docs4receiving.interface';
import { SqliteService } from 'src/app/services/sqlite.service';
import { DOC_TYPE } from 'src/app/enums/docs-4-receiving';
import { addIcons } from 'ionicons';
import { home, search } from 'ionicons/icons';
import { ScanBarComponent } from 'src/app/components/scan-bar/scan-bar.component';
import { SearchBarComponent } from 'src/app/components/common-components/search-bar/search-bar.component';
import { SearchFilterPipe } from 'src/app/pipes/search-filter.pipe';
import { ReceiptEachItemComponent } from 'src/app/components/goods-receipt/receipt-each-item/receipt-each-item.component';
import { Docs4receivingService } from 'src/app/services/docs4receiving.service';
import { HeaderComponent } from 'src/app/components/common-components/header/header.component';

@Component({
  selector: 'app-receipt-items',
  templateUrl: './receipt-items.page.html',
  styleUrls: ['./receipt-items.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanBarComponent,
    SearchBarComponent,
    ReceiptEachItemComponent,
    HeaderComponent,
  ],
  providers: [SearchFilterPipe],
})
export class ReceiptItemsPage {
  [x: string]: any;
  private router: Router = inject(Router);
  private sqliteService: SqliteService = inject(SqliteService);
  private navController: NavController = inject(NavController);
  private searchFilterPipe: SearchFilterPipe = inject(SearchFilterPipe);
  private docs4ReceivingService: Docs4receivingService = inject(
    Docs4receivingService
  );

  selectedDoc: IUniqueDocs = {
    Count: 0,
    CustomerName: '',
    LastUpdateDate: '',
    PoType: '',
    Requestor: '',
    VendorName: '',
    NeedByDate: '',
  };

  seletedDocType: DOC_TYPE = DOC_TYPE.PO_NUMBER;
  selectedDocItems: IDocs4ReceivingItems[] = [];
  filteredDocItems: any = [];
  isSearchBarShown: boolean = false;
  searchInputText: string = '';

  constructor() {
    addIcons({ home, search });
    const nav = this.router.getCurrentNavigation();
    this.selectedDoc = nav?.extras?.state?.['doc'];
    localStorage.setItem('selectedDoc', JSON.stringify(this.selectedDoc)); //first constructor is called then ngOnIn
  }
  async ngOnInit() {
    const stringifiedDoc: string | null = localStorage.getItem('selectedDoc');
    if (stringifiedDoc) {
      this.selectedDoc = JSON.parse(stringifiedDoc);
    }

    if (this.selectedDoc.PoNumber) {
      this.seletedDocType = DOC_TYPE.PO_NUMBER;
      this.selectedDocItems = await this.sqliteService.getDocItems(
        this.selectedDoc.PoNumber,
        DOC_TYPE.PO_NUMBER
      );
    } else if (this.selectedDoc.ASNNumber) {
      this.seletedDocType = DOC_TYPE.ASN_NUMBER;
      this.selectedDocItems = await this.sqliteService.getDocItems(
        this.selectedDoc.ASNNumber,
        DOC_TYPE.ASN_NUMBER
      );
    } else if (this.selectedDoc.RMANumber) {
      this.seletedDocType = DOC_TYPE.RMA_NUMBER;
      this.selectedDocItems = await this.sqliteService.getDocItems(
        this.selectedDoc.RMANumber,
        DOC_TYPE.RMA_NUMBER
      );
    }
    this.docs4ReceivingService.updateSelectedItemsAndDocType(
      this.selectedDocItems,
      this.seletedDocType
    );
    this.filteredDocItems = this.selectedDocItems;
  }

  handleSelectDocItem(index: number) {
    this.navController.navigateForward('/receipt-item-details', {
      state: {
        seletedDocItems: this.selectedDocItems,
        index: index,
        selectedItemType: this.seletedDocType,
      },
    });
  }

  handleSearchInputChange(searchTxt: string) {
    this.filteredDocItems = this.searchFilterPipe.transform(
      this.selectedDocItems,
      searchTxt
    );
  }

  handleSearchIconClick() {
    this.isSearchBarShown = !this.isSearchBarShown;
  }

  handleItemFound(scanSearchText: string) {
    this.searchInputText = scanSearchText;
    this.handleSearchInputChange(scanSearchText);
    console.log(this.selectedDocItems);
    this.navController.navigateForward('/receipt-item-details', {
      state: {
        seletedDocItems: this.selectedDocItems,
        index: this.selectedDocItems.findIndex(
          (doc) => doc.ItemNumber == scanSearchText
        ),
        selectedItemType: this.seletedDocType,
      },
    });
  }

  handleBackIconClick() {
    this.navController.back();
  }
  handleHomeIconClick() {
    this.navController.navigateRoot('home');
  }

  changeFormateOfDate(inputDate: string) {
    const [day, month, year] = inputDate.split(' ')[0].split('-');
    const months: string[] = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const newDate = `${day}-${months[parseInt(month) - 1]}-${year}`;
    return newDate;
  }
}
