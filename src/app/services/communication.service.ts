import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { IMetadata, IOrg, IUser } from '../models/user.interface';
import { SqliteService } from './sqlite.service';
import { OrganisationService } from './organisation.service';
import { ApiRequestService } from './api-request.service';
import { IApiDetails } from '../models/api.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private sqliteService: SqliteService = inject(SqliteService);
  private organizationService: OrganisationService =
    inject(OrganisationService);
  private apiRequestService: ApiRequestService = inject(ApiRequestService);

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

  async handleApiResponse(apiDetails: IApiDetails) {
    try {
      let apiResponse: any = await firstValueFrom(
        this.apiRequestService.request('GET', apiDetails.apiUrl, {})
      );
      if (!apiResponse || apiResponse.length === 0) {
        return {
          responsibility: apiDetails.responsibility,
          apiType: apiDetails.type,
          statusCode: 204,
          message: 'no content',
        };
      }
      let jsonRes;
      let metaData: IMetadata[];
      if (apiDetails.isCsv) {
        jsonRes = this.convertCsvToJson(apiResponse);
        metaData = this.getMetaDataForJson(jsonRes);
      } else {
        jsonRes = apiResponse[apiDetails.responseKey ?? ''];
        metaData = await firstValueFrom(
          this.apiRequestService.request(
            'GET',
            apiDetails.metadataUrl ?? '',
            {}
          )
        );
      }

      await this.sqliteService.createTable(metaData, apiDetails.tableName);
      await this.sqliteService.deleteAllRows(apiDetails.tableName);
      let chunks = this.divideResponseIntoChunks(jsonRes, 50);
      await Promise.all(
        chunks.map((chunk) =>
          this.sqliteService.insertValuesToTable(
            apiDetails.tableName,
            chunk,
            metaData
          )
        )
      );
      return {
        responsibility: apiDetails.responsibility,
        apiType: apiDetails.type,
        statusCode: 200,
        message: 'All ok',
      };
    } catch (err) {
      console.log(err);
      return {
        responsibility: apiDetails.responsibility,
        apiType: apiDetails.type,
        statusCode: 500,
        message: 'Internal server error',
      };
    }
  }

  divideResponseIntoChunks<T>(response: T[], size: number) {
    const chunks: T[][] = [];
    for (let i = 0; i < response.length; i += size) {
      chunks.push(response.slice(i, i + size));
    }
    return chunks;
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
