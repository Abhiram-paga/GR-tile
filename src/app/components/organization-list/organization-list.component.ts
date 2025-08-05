import { Component, inject, Input, OnInit } from '@angular/core';
import { IOrg } from 'src/app/models/user.interface';
import { IonicModule } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { OrganisationService } from 'src/app/services/organisation.service';
import { NoItemsComponent } from "../common-components/no-items/no-items.component";

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
  imports: [IonicModule, ScrollingModule, CommonModule, NoItemsComponent],
})
export class OrganizationListComponent implements OnInit {
  private oraganizationService: OrganisationService =
    inject(OrganisationService);

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

  changeSelectedOrg(
    selectedOrgId: string,
    businessUnitId: string,
    selectedOrgName: string
  ) {
    this.selectedOrgId = selectedOrgId;
    this.oraganizationService.selectedOrgId = selectedOrgId;
    this.oraganizationService.selectedBusinessUnitId = businessUnitId;
    localStorage.setItem('businessUnitId', businessUnitId);
    this.oraganizationService.selectedOrgCode = selectedOrgName;
  }

  ngOnInit() {}
}
