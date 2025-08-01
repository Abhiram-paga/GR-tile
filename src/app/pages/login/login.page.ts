import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { LoginFormComponent } from 'src/app/components/login-form/login-form.component';
import { LOGOS } from 'src/assets/logo';
import { UserService } from 'src/app/services/user.service';
import {
  IUserLogin,
  IUser,
  IUserLoginRes,
} from 'src/app/models/user.interface';
import { Subscription } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import { ModelLoaderService } from 'src/app/services/model-loader.service';
import { SqliteService } from 'src/app/services/sqlite.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { Router } from '@angular/router';
import { API_TABLE_NAMES } from 'src/app/enums/api-details';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, LoginFormComponent],
})
export class LoginPage {
  logoPath = LOGOS.companyLogo;

  private userService: UserService = inject(UserService);
  private communicationService: CommunicationService =
    inject(CommunicationService);
  private loaderService: ModelLoaderService = inject(ModelLoaderService);
  private sqliteService: SqliteService = inject(SqliteService);
  private organizationService: OrganisationService =
    inject(OrganisationService);
  private router: Router = inject(Router);

  subscriptions: Subscription = new Subscription();

  ngOnInit() {
    const subscription2 = this.communicationService.action$.subscribe({
      next: (res: IUser) => {
        this.handleFormSubmission(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
    this.subscriptions.add(subscription2);
  }

  async handleFormSubmission(user: IUser) {
    await this.loaderService.showLoader();
    try {
      const subscription1 = this.userService.loginUser(user).subscribe({
        next: async (res: IUserLogin) => {
          await this.userService.handelLoginResponse(res);

          const responsibilities: IUserLoginRes[] =
            await this.sqliteService.getTableRows(API_TABLE_NAMES.LOGIN);
          this.userService.userLoginResponseResponsibilities = responsibilities;
          const filteredResponsibilities = responsibilities.filter(
            (responsibility) => responsibility.DEFAULT_ORG_ID
          );

          const defaultOrgId: string =
            filteredResponsibilities[0].DEFAULT_ORG_ID;
          localStorage.setItem('defaultOrgId', defaultOrgId);

          this.organizationService.defaultOrgId = defaultOrgId;
          const subscription3 = this.organizationService
            .getInventoryOrganizationsTable(defaultOrgId)
            .subscribe({
              next: async (res) => {
                this.communicationService.manageCsvApiResponse(
                  res,
                  API_TABLE_NAMES.GET_ORGANIZATIONS
                );
                this.loaderService.hideLoader();
                this.router.navigate(['/organizations']);
              },
              error: (err) => {
                console.error(err);
              },
            });
          this.subscriptions.add(subscription3);
        },

        error: (err) => {
          console.error(err);
        },
      });
      this.subscriptions.add(subscription1);
    } catch (err) {
      console.error(err);
    }
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
