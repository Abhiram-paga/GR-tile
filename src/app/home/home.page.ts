import { Component, inject } from '@angular/core';
import { OrganisationService } from '../services/organisation.service';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, logOut, refresh } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
import { API_TABLE_NAMES } from '../enums/api-details';
import { HOME_PAGE } from '../constants/home-page';
import { DOC_TYPE } from '../enums/docs-4-receiving';
import { HomeCardComponent } from '../components/home-card/home-card.component';

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

  menuOptions: { name: string; iconName: string }[] | undefined;
  openDocs: number = 0;
  constructor() {
    addIcons({
      home,
      refresh,
      logOut,
    });
  }

  ionViewWillEnter() {
    this.menuOptions = HOME_PAGE.MENU_OPTIONS;
  }

  handleMenuOptionClick(name: string) {
    if (name === 'Home') {
      this.router.navigate(['/home']);
    } else if (name === 'Logout') {
      this.router.navigate(['/login']);
    } else if (name === 'Refresh On hand Qty') {
      this.sqliteService.getTableRows(
        API_TABLE_NAMES.GET_DOCUMENTS_FOR_RECEIVING
      );
    }
  }
}
