import { inject, Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { IMetadata } from '../models/user.interface';
import { API_TABLE_NAMES } from '../enums/api-details';
import { DOC_TYPE } from '../enums/docs-4-receiving';
import { JOINS } from '../enums/query';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private sqlite: SQLiteConnection | undefined;
  private db: SQLiteDBConnection | undefined;
  private datePipe: DatePipe = inject(DatePipe);

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initDB() {
    try {
      const dbName = 'supply-chain';

      await this.sqlite?.checkConnectionsConsistency();
      const connRes = await this.sqlite?.isConnection(dbName, true);
      console.log('Is connection exists:', connRes);

      if (connRes?.result) {
        console.log('Retrieving existing DB connection...');
        this.db = await this.sqlite?.retrieveConnection(dbName, true);
      } else {
        console.log('Creating new DB connection...');
        this.db = await this.sqlite?.createConnection(
          dbName,
          false,
          'no_encryption',
          1,
          false
        );
      }

      if (!this.db) {
        console.error('SQLite DB connection could not be established!');
        return;
      }

      await this.db.open();
    } catch (err) {
      console.log('DB init error:', err);
    }
  }

  async createTable(metadata: IMetadata[], tableName: string) {
    try {
      if (!metadata || metadata.length === 0) {
        console.warn(`no metadata found for ${tableName}`);
        return;
      }
      const columns = metadata
        .map((data: IMetadata) => {
          return `${data.name} ${data.type}`;
        })
        .join(',');
      let createTableQuery: string;
      let primaryKeys = metadata.filter((metaobj) => metaobj.primarykey);
      if (primaryKeys.length > 0) {
        let primaryKeyColumns = primaryKeys
          .map((data) => `${data.name}`)
          .join(',');
        createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName}(${columns},PRIMARY KEY(${primaryKeyColumns}))`;
      } else {
        createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName}(${columns})`;
      }
      await this.db?.run(createTableQuery);
      console.log(`${tableName} created`);
    } catch (err) {
      console.log('error in creating table:', err);
    }
  }

  async dropTable(tableName: API_TABLE_NAMES) {
    try {
      await this.db?.run(`DROP TABLE ${tableName}`);
      console.log(`${tableName} id deleted`);
    } catch (err) {
      console.error(err);
    }
  }

  async getTableRows<T>(tableName: API_TABLE_NAMES): Promise<T[]> {
    try {
      const rows = await this.db?.query(`SELECT * FROM ${tableName}`);
      if (!rows) {
        console.log(`No rows returned for table: ${tableName}`);
        return [];
      }

      console.log(`Rows from table '${tableName}':`, rows.values);
      return rows.values as T[];
    } catch (err) {
      console.error(err);
      throw Error('Error in getting table rows');
    }
  }

  async getTableRowsWithOrderBy<T>(
    tableName: API_TABLE_NAMES,
    orderByColumn: string
  ) {
    try {
      const rows = await this.db?.query(
        `SELECT * FROM ${tableName} ORDER BY ${orderByColumn}`
      );
      if (!rows) {
        console.log(`No rows returned for table: ${tableName}`);
        return [];
      }

      console.log(`Rows from table '${tableName}':`, rows.values);
      return rows.values as T[];
    } catch (err) {
      console.error(err);
      throw Error('Error in getting table rows');
    }
  }

  async getTableRowsWithWhereClause(
    tableName: API_TABLE_NAMES,
    columnName: string,
    columnValue: string | number
  ) {
    try {
      const getRowsQuery = `SELECT * FROM ${tableName} WHERE ${columnName}=${columnValue}`;
      const result = await this.db?.query(getRowsQuery);
      return result?.values ?? [];
    } catch (err) {
      console.error(err);
      throw new Error(
        `Error in getting rows with where clause on ${tableName}`
      );
    }
  }

  async updateColumnValueOfRow(
    tableName: API_TABLE_NAMES,
    column1Name: string,
    column2Name: string,
    column1Value: string,
    column2Value: string,
    conditionColumn: string,
    conditionValue: string,
    updateSyncTime: boolean = false
  ) {
    try {
      let updateQuery = '';
      let params: any[] = [];

      if (updateSyncTime) {
        const formattedDate = this.datePipe.transform(
          new Date(),
          'dd-MMM-yyyy HH:mm:ss'
        );
        updateQuery = `UPDATE ${tableName} 
                     SET ${column1Name} = ?, 
                         ${column2Name} = ?, 
                         syncedTime = ? 
                     WHERE ${conditionColumn} = ?`;
        params = [column1Value, column2Value, formattedDate, conditionValue];
      } else {
        updateQuery = `UPDATE ${tableName} 
                     SET ${column1Name} = ?, 
                         ${column2Name} = ? 
                     WHERE ${conditionColumn} = ?`;
        params = [column1Value, column2Value, conditionValue];
      }

      await this.db?.run(updateQuery, params);
      console.log(`Updated ${tableName}`, params);
    } catch (err) {
      console.error(`Error in updating ${tableName}:`, err);
    }
  }

  async updateRemainingQty(itemNumber: string, qtyValue: number) {
    try {
      const updateQuery = `UPDATE ${API_TABLE_NAMES.GET_DOCUMENTS_FOR_RECEIVING} 
      SET QtyRemaining=${qtyValue}
       WHERE ItemNumber="${itemNumber}";`;
      await this.db?.query(updateQuery);
      console.log(`Updated RemainingQty of ${itemNumber}`);
    } catch (err) {
      console.error(err);
      throw new Error(`Error in updating quantity`);
    }
  }

  async insertValuesToTable(
    tableName: string,
    data: any[],
  ) {
    try {
      const columns = Object.keys(data[0]);
      const placeHolders = columns.map(() => '?').join(',');
      const insertRowsQuery = `INSERT OR IGNORE INTO ${tableName} (${columns.join(
        ','
      )}) VALUES(${placeHolders})`;

      const insertPromises = data.map((row) => {
        const values = columns.map((col: string | number) => row[col]);
        return this.db?.run(insertRowsQuery, values);
      });
      await Promise.all(insertPromises);
      console.log('Inserted', data.length, 'rows');
    } catch (err) {
      console.log('Error in inserting values', err);
    }
  }

  async deleteAllRows(tableName: string) {
    try {
      await this.db?.run(`DELETE FROM ${tableName}`);
      console.log(`Deleted All rows from table:${tableName}`);
    } catch (err) {
      console.log(`Error in deleting rows of ${tableName}`, err);
    }
  }

  async getDocItems(docNumber: number, docColumn: string) {
    try {
      const getItemsQuery = `SELECT * FROM ${API_TABLE_NAMES.GET_DOCUMENTS_FOR_RECEIVING} 
      where ${docColumn}=${docNumber}`;
      const result = await this.db?.query(getItemsQuery);
      return result?.values ?? [];
    } catch (err) {
      console.error(`Error in getting items of #${docNumber} doc`, err);
      throw new Error('Error in getting items');
    }
  }

  async getJoinedRowsOfTwoTablesWithHaving(
    table1: API_TABLE_NAMES,
    table2: API_TABLE_NAMES,
    joinName: JOINS,
    table1Column: string,
    table2Column: string,
    havingColumn: string,
    havingValue: string | number
  ) {
    try {
      const query = `SELECT * FROM ${table1} 
      ${joinName} 
      ${table2}
       ON ${table1}.${table1Column}=${table2}.${table2Column}
        GROUP BY ${table1}.${table1Column} 
        HAVING ${havingColumn}="${havingValue}"`;

      const result = await this.db?.query(query);
      return result?.values ?? [];
    } catch (err) {
      console.error(err);
      throw new Error(`Error in joining ${table1} and ${table2} table`);
    }
  }

  async getRowsAfterGroupByFromDocs4Receive(
    tableName: API_TABLE_NAMES,
    groupByColumn: DOC_TYPE
  ) {
    try {
      const groupByQuery = `SELECT ${groupByColumn},PoType,VendorName,CustomerName,LastUpdateDate,NeedByDate,
      Requestor,COUNT(*) as Count FROM ${tableName} 
      WHERE ${groupByColumn} IS NOT NULL AND ${groupByColumn} != '' 
      GROUP BY ${groupByColumn} ORDER BY   
      SUBSTR(LastUpdateDate, 7, 4) || '-' || 
      SUBSTR(LastUpdateDate, 4, 2) || '-' || 
      SUBSTR(LastUpdateDate, 1, 2) || ' ' || 
      SUBSTR(LastUpdateDate, 12)
      DESC`;
      const result = await this.db?.query(groupByQuery);
      console.log(result);
      return result?.values ?? [];
    } catch (err) {
      console.error(
        `Error in group by ${groupByColumn} in table ${tableName}`,
        err
      );
      throw new Error('Error in groupBY');
    }
  }

  async createTableForCSVRes(tableName: string, data: any) {
    try {
      const columns = data[0].map((col: string) =>
        col.includes('_PK') ? `${col} text PRIMARY KEY` : `${col} text`
      );
      const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName}(${columns.join(
        ','
      )})`;
      await this.db?.run(createTableQuery);
      console.log(`${tableName} created successfully`);
    } catch (err) {
      console.error('Error in creating table for csv response:', err);
    }
  }
}
