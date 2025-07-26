import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
  IonFooter,
} from '@ionic/angular/standalone';
import { filter, map, Subscription } from 'rxjs';
import { RefresherComponent } from 'src/app/components/refresher/refresher.component';
import { IOrg } from 'src/app/models/user.interface';
import { OrganisationService } from 'src/app/services/organisation.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { OrganizationListComponent } from 'src/app/components/organization-list/organization-list.component';
import { ButtonComponent } from 'src/app/components/common-components/button/button.component';
import { SearchBarComponent } from 'src/app/components/common-components/search-bar/search-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.page.html',
  styleUrls: ['./organizations.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    OrganizationListComponent,
    RefresherComponent,
    ButtonComponent,
    IonFooter,
    SearchBarComponent,
  ],
})
export class OrganizationsPage {
  organizationService: OrganisationService = inject(OrganisationService);
  private communicationService: CommunicationService =
    inject(CommunicationService);
  router:Router=inject(Router)

  subscriptions: Subscription = new Subscription();
  organizationsList: IOrg[] = [];

  ionViewWillEnter() {
    const sub1 = this.organizationService.organizations$.subscribe({
      next: (res: IOrg[]) => {
        this.organizationsList = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscriptions.add(sub1);
  }

  onRefreher(event: RefresherCustomEvent) {
    const sub2 = this.organizationService
      .getInventoryOrganizationsTable(this.organizationService.defaultOrgId)
      .subscribe({
        next: (res) => {
          this.communicationService.manageCsvApiResponse(
            res,
            'organizationTable'
          );
          event.target.complete();
        },
        error: (err) => {
          console.log(err);
        },
      });
    this.subscriptions.add(sub2);
  }

  confirmOrgClick() {
    this.router.navigate(['/activity'])
  }

  handleChangeOrgName(searchText: string) {
    const sub2 = this.organizationService.organizations$
      .pipe(
        map((list) =>
          list.filter(
            (org) =>
              org.InventoryOrgCode.toLowerCase().includes(
                searchText.toLowerCase()
              ) ||
              org.InventoryOrgName.toLowerCase().includes(
                searchText.toLowerCase()
              )
          )
        )
      )
      .subscribe({
        next: (res: IOrg[]) => {
          this.organizationsList = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
    this.subscriptions.add(sub2);
  }

  ionViewDidLeave() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
