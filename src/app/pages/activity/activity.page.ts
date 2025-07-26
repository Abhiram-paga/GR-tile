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

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ActivityCardComponent],
})
export class ActivityPage implements OnInit {
  modelAlertService: ModelLoaderService = inject(ModelLoaderService);
  private apiSyncService: SyncApiService = inject(SyncApiService);
  private responsibiltiesService: ResponsibilitiesService = inject(
    ResponsibilitiesService
  );

  subscription: Subscription = new Subscription();

  apiStatusDetails: IApiDetails[] = [];

  constructor() {
    addIcons({
      logOut,
    });
  }

  ngOnInit() {
    this.apiSyncService.syncApi(false);
    const statusDetails = this.responsibiltiesService.apiStatus$.subscribe({
      next: (response: IApiDetails[]) => {
        this.apiStatusDetails = response;
      },
    });
    this.subscription.add(statusDetails);
  }

  IonViewDidLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
