import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { IMetadata } from '../models/user.interface';
import { API_TABLE_NAMES } from '../enums/api-details';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private sqlite: SQLiteConnection | undefined;
  private db: SQLiteDBConnection | undefined;

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

  async getTableRows(tableName: API_TABLE_NAMES) {
    try {
      const rows = await this.db?.query(`SELECT * FROM ${tableName}`);
      if (!rows || !rows.values) {
        console.log(`No rows returned for table: ${tableName}`);
        return [];
      }

      console.log(`Rows from table '${tableName}':`, rows.values);
      return rows.values;
    } catch (err) {
      console.error(err);
      throw Error('Error in getting table rows');
    }
  }

  async insertValuesToTable(
    tableName: string,
    data: any[],
    metadata: IMetadata[]
  ) {
    try {
      const columns = metadata.map((col) => col.name);
      const placeHolders = metadata.map((col) => '?').join(',');
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

  async getRowsAfterGroupByFromDocs4Receive(
    tableName: API_TABLE_NAMES,
    groupByColumn: string | number | boolean
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
