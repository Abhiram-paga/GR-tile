import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RefresherCustomEvent } from '@ionic/angular/standalone';
import { CommunicationService } from 'src/app/services/communication.service';
import { OrganisationService } from 'src/app/services/organisation.service';
@Component({
  selector: 'app-refresher',
  templateUrl: './refresher.component.html',
  styleUrls: ['./refresher.component.scss'],
  imports: [IonicModule],
})
export class RefresherComponent implements OnInit {
  private organizationService: OrganisationService =
    inject(OrganisationService);
  private communicationService: CommunicationService =
    inject(CommunicationService);
  @Output() onRefresherEmit = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}

  handleRefresh(event: RefresherCustomEvent) {
    this.onRefresherEmit.emit(event);
  }
}
