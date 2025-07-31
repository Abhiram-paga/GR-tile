import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logOut } from 'ionicons/icons';
import { ModelLoaderService } from 'src/app/services/model-loader.service';
import { SyncApiService } from 'src/app/services/sync-api.service';
import { ResponsibilitiesService } from 'src/app/services/responsibilities.service';
import { ActivityCardComponent } from 'src/app/components/activity-card/activity-card.component';
import { IApiDetails } from 'src/app/models/api.interface';
import { Subscription } from 'rxjs';
import { ButtonComponent } from 'src/app/components/common-components/button/button.component';
import { API_STATUS, API_TYPE } from 'src/app/enums/api-details';
import { Router } from '@angular/router';
import { OrganisationService } from 'src/app/services/organisation.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityCardComponent,
    ButtonComponent,
  ],
})
export class ActivityPage implements OnInit {
  modelAlertService: ModelLoaderService = inject(ModelLoaderService);
  private apiSyncService: SyncApiService = inject(SyncApiService);
  private responsibiltiesService: ResponsibilitiesService = inject(
    ResponsibilitiesService
  );
  private organizationService: OrganisationService =
    inject(OrganisationService);
  private router: Router = inject(Router);

  subscription: Subscription = new Subscription();

  apiStatusDetails: IApiDetails[] = [];

  reSync: boolean = false;

  constructor() {
    addIcons({
      logOut,
    });
  }

  ngOnInit() {
    this.apiSyncService.syncApi(false);
    const statusDetailsSubscription =
      this.responsibiltiesService.apiStatus$.subscribe({
        next: (response: IApiDetails[]) => {
          this.apiStatusDetails = response;

          this.reSync = response.some(
            (api) =>
              api.apiStatus === API_STATUS.FAILED ||
              (api.apiStatus === API_STATUS.NO_CONTENT &&
                (api.type === API_TYPE.MASTER || api.type === API_TYPE.CONFIG))
          );

          this.checkAllApisSucess(response);
        },
      });
    this.subscription.add(statusDetailsSubscription);
  }

  reSyncFailedApis() {
    const failedApis: IApiDetails[] = this.apiStatusDetails.filter(
      (apiDetails: IApiDetails) =>
        apiDetails.apiStatus === API_STATUS.FAILED ||
        (apiDetails.apiStatus === API_STATUS.NO_CONTENT &&
          (apiDetails.type === API_TYPE.MASTER ||
            apiDetails.type === API_TYPE.CONFIG))
    );
    this.apiSyncService.syncFailedApis(failedApis);
  }

  checkAllApisSucess(response: IApiDetails[]) {
    const successApis: boolean = response
      .filter(
        (apiResponse) =>
          apiResponse.type === API_TYPE.CONFIG ||
          apiResponse.type === API_TYPE.MASTER
      )
      .every((api) => api.apiStatus === API_STATUS.SUCCESS);
    if (successApis) {
      this.router.navigate(['/home']);
    }
  }

  IonViewDidLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
