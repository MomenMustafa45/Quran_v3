declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    executeSql(sqlStatement: string, params?: any[]): Promise<[ResultSet]>;
    close(): Promise<void>;
  }

  export interface ResultSet {
    rowsAffected: number;
    insertId: number;
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

declare module 'react-native-vector-icons/Feather' {
  import { Icon } from 'react-native-vector-icons/Icon';
  export default Icon;
}

declare module 'react-native-vector-icons/*' {
  import { Icon } from 'react-native-vector-icons/Icon';
  export default Icon;
}
