import { inject, Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { API_TABLE_NAMES } from '../enums/api-details';
import { IuniqueDocs } from '../models/docs4receiving.interface';
import { DOC_TYPE } from '../enums/docs-4-receiving';

@Injectable({
  providedIn: 'root',
})
export class Docs4receivingService {
  uniquePOlist: IuniqueDocs[] = [];
  uniqueASNlist: IuniqueDocs[] = [];
  uniqueRMAlist: IuniqueDocs[] = [];

  private sqliteService: SqliteService = inject(SqliteService);

  constructor() {}

  async getUniqueDocslist(groupByColumn: string ) {
    try {
      const result =
        await this.sqliteService.getRowsAfterGroupByFromDocs4Receive(
          API_TABLE_NAMES.GET_DOCUMENTS_FOR_RECEIVING,
          groupByColumn
        );
      if (groupByColumn === DOC_TYPE.PO_NUMBER) {
        this.uniquePOlist = result;
      } else if (groupByColumn === DOC_TYPE.ASN_NUMBER) {
        this.uniqueASNlist = result;
      } else if (groupByColumn === DOC_TYPE.RMA_NUMBER) {
        this.uniqueRMAlist = result;
      }
    } catch (err) {
      console.log(err);
    }
  }

}
