import { Component, inject, Input, OnInit } from '@angular/core';
import { IOrg } from 'src/app/models/user.interface';
import { IonicModule } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { OrganisationService } from 'src/app/services/organisation.service';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
  imports: [IonicModule, ScrollingModule, CommonModule],
})
export class OrganizationListComponent implements OnInit {
  private oraganizationService:OrganisationService=inject(OrganisationService);

  @Input() organizationsList: IOrg[] = [];

  selectedOrgId: string = '';


  constructor() {
    addIcons({
      checkmarkCircle,
    });
  }

  trackByOrg(index: number, org: IOrg): string {
    return org.InventoryOrgId_PK;
  }

  handleClick(): void {
    console.log(this.organizationsList);
  }

  changeSelectedOrg(selectedOrgId: string) {
    this.selectedOrgId = selectedOrgId;
    this.oraganizationService.selectedOrdId=selectedOrgId;
  }


  ngOnInit() {}
}
