declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    executeSql(sqlStatement: string, params?: any[]): Promise<[ResultSet]>;
    close(): Promise<void>;
  }

  export interface ResultSet {
    rows: {
      length: number;
      item: (index: number) => any;
    };
  }

  export interface OpenDatabaseParams {
    name: string;
    location?: 'default' | 'Library' | 'Documents';
    createFromLocation?: number;
  }

  export function openDatabase(
    params: OpenDatabaseParams,
  ): Promise<SQLiteDatabase>;

  export function enablePromise(enable: boolean): void;
}
