import { Component, inject, Input, OnInit } from '@angular/core';
import { IApiDetails } from 'src/app/models/api.interface';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IonCard } from '@ionic/angular/standalone';
import { ResponsibilitiesService } from 'src/app/services/responsibilities.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
  imports: [ScrollingModule, IonCard, CommonModule],
})
export class ActivityCardComponent implements OnInit {
  private resposibilitiesService: ResponsibilitiesService = inject(
    ResponsibilitiesService
  );

  apiUserResponsibilties: string[] = [];

  @Input() apiStatusList: IApiDetails[] = [];

  constructor() {}

  async ngOnInit() {
    try {
      this.apiUserResponsibilties =
        await this.resposibilitiesService.getResponsibilities();
    } catch (err) {
      console.log(err);
    }
  }
}
