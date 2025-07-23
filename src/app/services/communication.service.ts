import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IMetadata, IOrg, IUser } from '../models/user.interface';
import { SqliteService } from './sqlite.service';
import { OrganisationService } from './organisation.service';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private sqliteService: SqliteService = inject(SqliteService);
  private organizationService: OrganisationService =
    inject(OrganisationService);

  private readonly actionSource = new Subject<IUser>();
  private functionSubject = new Subject<() => void>();
  function$ = this.functionSubject.asObservable();
  action$ = this.actionSource.asObservable();

  sendFunction(fn: () => void) {
    this.functionSubject.next(fn);
  }

  triggerAction(user: IUser) {
    this.actionSource.next(user);
  }

  convertCsvToJson(rawData: any) {
    const [headers, ...rows] = rawData;
    const jsonArray = rows.map((row: any) => {
      const obj: Record<string, any> = {};
      headers.forEach((key: string, i: number) => {
        obj[key] = row[i];
      });
      return obj;
    });
    console.log('Coverted Json result:', jsonArray);
    return jsonArray;
  }

  getMetaDataForJson(jsonArray: any) {
    let metaData = [];
    for (let key in jsonArray[0]) {
      let obj = {
        name: key,
        type: 'text',
        ...(key.includes('_PK') ? { primaryKey: 'true' } : {}),
      };
      metaData.push(obj);
    }
    return metaData;
  }

  async manageCsvApiResponse(res: any, tableName: string) {
    const jsonRes = this.convertCsvToJson(res);
    const metaData: IMetadata[] = this.getMetaDataForJson(jsonRes);

    await this.sqliteService.createTable(metaData, tableName);
    await this.sqliteService.deleteAllRows(tableName);
    await this.sqliteService.insertValuesToTable(tableName, jsonRes, metaData);
    if (tableName === 'organizationTable') {
      const organizations: IOrg[] = await this.sqliteService.getTableRows(
        tableName
      );

      this.organizationService.organizationsSub.next(organizations);
    }
  }
}
