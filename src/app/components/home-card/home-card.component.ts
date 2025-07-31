import { Component, inject, Input } from '@angular/core';
import { DOC_TYPE } from 'src/app/enums/docs-4-receiving';
import { Docs4receivingService } from 'src/app/services/docs4receiving.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { API_TABLE_NAMES } from 'src/app/enums/api-details';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class HomeCardComponent {
  @Input() responsibilitiesList = [
    { name: 'Goods Receipt' },
    { name: 'PO Inspection' },
  ];
  openDocs: number = 0;
  completedDocs = 0;

  private docs4ReceivinService: Docs4receivingService = inject(
    Docs4receivingService
  );
  private sqliteService: SqliteService = inject(SqliteService);

  constructor() {
    this.docs4ReceivinService.getUniqueDocslist(DOC_TYPE.PO_NUMBER);
    this.docs4ReceivinService.getUniqueDocslist(DOC_TYPE.ASN_NUMBER);
    this.docs4ReceivinService.getUniqueDocslist(DOC_TYPE.RMA_NUMBER);
  }

  async ngOnInit() {
    try {
      this.openDocs =
        (
          await this.sqliteService.getRowsAfterGroupByFromDocs4Receive(
            API_TABLE_NAMES.GET_DOCUMENTS_FOR_RECEIVING,
            DOC_TYPE.PO_NUMBER
          )
        ).length +
        (
          await this.sqliteService.getRowsAfterGroupByFromDocs4Receive(
            API_TABLE_NAMES.GET_DOCUMENTS_FOR_RECEIVING,
            DOC_TYPE.ASN_NUMBER
          )
        ).length +
        (
          await this.sqliteService.getRowsAfterGroupByFromDocs4Receive(
            API_TABLE_NAMES.GET_DOCUMENTS_FOR_RECEIVING,
            DOC_TYPE.RMA_NUMBER
          )
        ).length;
    } catch (err) {
      console.error(err);
    }
  }

  get percent(): number {
    return this.openDocs === 0
      ? 0
      : Math.round((this.completedDocs / this.openDocs) * 100);
  }
}
