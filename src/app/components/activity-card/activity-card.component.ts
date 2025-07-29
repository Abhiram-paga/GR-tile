import { Component, inject, Input, OnInit } from '@angular/core';
import { IApiDetails } from 'src/app/models/api.interface';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ResponsibilitiesService } from 'src/app/services/responsibilities.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
  imports: [ScrollingModule, CommonModule, IonicModule],
  animations: [
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '400ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class ActivityCardComponent implements OnInit {
  private resposibilitiesService: ResponsibilitiesService = inject(
    ResponsibilitiesService
  );

  apiUserResponsibilties: string[] = [];

  @Input() apiStatusList: IApiDetails[] = [];

  constructor() {
    addIcons({
      checkmarkCircle,
      closeCircle,
    });
  }

  trackByResponsibility(index: number, item: IApiDetails) {
    return item.responsibility;
  }
  

  async ngOnInit() {
    try {
      this.apiUserResponsibilties =
        await this.resposibilitiesService.getResponsibilities();
    } catch (err) {
      console.log(err);
    }
  }
}
