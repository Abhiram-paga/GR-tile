import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { IMetadata } from '../models/user.interface';

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
      const columns = metadata
        .map((data: IMetadata) => {
          return `${data.name} ${data.type} ${
            data.primaryKey ? 'PRIMARY KEY' : ''
          }`;
        })
        .join(',');
      const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName}(${columns})`;
      await this.db?.run(createTableQuery);
    } catch (err) {
      console.log('error in creating table:', err);
    }
  }

  async getTableRows(tableName: String) {
    try {
      const rows = await this.db?.query(`SELECT * FROM ${tableName}`);
      if (!rows || !rows.values) {
        console.log(`No rows returned for table: ${tableName}`);
        return [];
      }

      console.log(`Rows from table '${tableName}':`, rows.values);
      return rows.values;
    } catch (err) {
      console.log(err);
      return [];
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
      const insertRowsQuery = `INSERT INTO ${tableName} (${columns.join(
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

  async deleteAllRows(tableName:string){
    try{ 
      await this.db?.run(`DELETE FROM ${tableName}`);
      console.log(`Deleted All rows from table:${tableName}`);
    }catch(err){
      console.log(`Error in deleting rows of ${tableName}`,err);
    }
  }
}
