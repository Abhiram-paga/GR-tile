import { Component, inject } from '@angular/core';
import { OrganisationService } from '../services/organisation.service';
import { IonicModule, MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, logOut, refresh } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
import { API_TABLE_NAMES } from '../enums/api-details';
import { HOME_PAGE } from '../constants/home-page';
import { HomeCardComponent } from '../components/home-card/home-card.component';
import { DOC_TYPE } from '../enums/docs-4-receiving';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, HomeCardComponent],
})
export class HomePage {
  organizationsService: OrganisationService = inject(OrganisationService);
  private sqliteService: SqliteService = inject(SqliteService);
  private router: Router = inject(Router);
  private menuCtrl: MenuController = inject(MenuController);

  menuOptions: { name: string; iconName: string }[] | undefined;
  openDocs: number = 0;

  constructor() {
    addIcons({
      home,
      refresh,
      logOut,
    });
  }

  async ngOnInit() {
    this.menuOptions = HOME_PAGE.MENU_OPTIONS;
    try {
      this.openDocs =
        (
          await this.sqliteService.getRowsAfterGroupByFromDocs4Receive(
            API_TABLE_NAMES.GET_DOCUMENTS_FOR_RECEIVING,
            DOC_TYPE.PO_NUMBER
          )
        ).length +
        (
          await this.sqliteService.getRowsAfterGroupByFromDocs4Receive(
            API_TABLE_NAMES.GET_DOCUMENTS_FOR_RECEIVING,
            DOC_TYPE.ASN_NUMBER
          )
        ).length +
        (
          await this.sqliteService.getRowsAfterGroupByFromDocs4Receive(
            API_TABLE_NAMES.GET_DOCUMENTS_FOR_RECEIVING,
            DOC_TYPE.RMA_NUMBER
          )
        ).length;
      console.log(this.openDocs);
    } catch (err) {
      console.error(err);
    }
  }

  async handleMenuOptionClick(name: string) {
    await this.menuCtrl.close();
    if (name === 'Home') {
      this.router.navigate(['/home']);
    } else if (name === 'Logout') {
      this.router.navigate(['/login']);
    } else if (name === 'Logout + Clear Data') {
      this.handleLogoutClearData();
    }
  }

  async handleLogoutClearData() {
    try {
      localStorage.clear();
      let tablesList = [
        API_TABLE_NAMES.GET_DOCUMENTS_FOR_RECEIVING,
        API_TABLE_NAMES.GET_GL_PERIODS,
        API_TABLE_NAMES.GET_INVENTORY_PERIODS,
        API_TABLE_NAMES.GET_ITEMS,
        API_TABLE_NAMES.GET_LOCATIONS,
        API_TABLE_NAMES.GET_LOCATORS,
        API_TABLE_NAMES.GET_ORGANIZATIONS,
        API_TABLE_NAMES.GET_SUBINVENTORIES,
        API_TABLE_NAMES.TRANSACTION_HISTORY,
        API_TABLE_NAMES.LOGIN,
      ];
      Promise.all(
        tablesList.map((table) => this.sqliteService.dropTable(table))
      )
        .then(() => {
          console.log('All tables dropped successfully');
        })
        .catch((error) => {
          console.error('Failed to drop one or more tables:', error);
        });

      this.router.navigate(['/login']);
    } catch (err) {
      console.error(err);
    }
  }
}
