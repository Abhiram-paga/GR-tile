import { inject, Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { API_TABLE_NAMES } from '../enums/api-details';
import {
  IDocs4ReceivingItems,
  IUniqueDocs,
} from '../models/docs4receiving.interface';
import { DOC_TYPE } from '../enums/docs-4-receiving';

@Injectable({
  providedIn: 'root',
})
export class Docs4receivingService {
  uniquePOlist: IUniqueDocs[] = [];
  uniqueASNlist: IUniqueDocs[] = [];
  uniqueRMAlist: IUniqueDocs[] = [];
  AllUniqueDocsList: IUniqueDocs[] = [];

  selectedItemsList: IDocs4ReceivingItems[] = [];
  selectedDocType: DOC_TYPE = DOC_TYPE.PO_NUMBER;

  private sqliteService: SqliteService = inject(SqliteService);

  constructor() {}

  async getUniqueDocslist(groupByColumn: DOC_TYPE) {
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
      this.AllUniqueDocsList = [
        ...this.uniquePOlist,
        ...this.uniqueASNlist,
        ...this.uniqueRMAlist,
      ];
    } catch (err) {
      console.log(err);
      throw new Error(`Error in getting group by on ${groupByColumn}`);
    }
  }

  updateSelectedItemsAndDocType(
    selectedItems: IDocs4ReceivingItems[],
    selectedDocType: DOC_TYPE
  ) {
    this.selectedItemsList = selectedItems;
    this.selectedDocType = selectedDocType;
  }

  async getPoItems(selectedId: number, selectedDocType: DOC_TYPE) {
    try {
      const res = await this.sqliteService.getDocItems(
        selectedId,
        selectedDocType
      );
      return res;
    } catch (err) {
      console.error(err);
      throw new Error('Error in getting PO items from DB');
    }
  }

  async getASNItems(selectedDoc: IUniqueDocs, selectedDocType: DOC_TYPE) {
    try {
      const res = await this.sqliteService.getDocItems(
        selectedDoc.ASNNumber!,
        selectedDocType
      );
      return res;
    } catch (err) {
      console.error(err);
      throw new Error('Error in getting ASN items from DB');
    }
  }
  async getRMAItems(selectedDoc: IUniqueDocs, selectedDocType: DOC_TYPE) {
    try {
      const res = await this.sqliteService.getDocItems(
        selectedDoc.RMANumber!,
        selectedDocType
      );
      return res;
    } catch (err) {
      console.error(err);
      throw new Error('Error in getting RMA items from DB');
    }
  }
}
