// connection.ts
import { Platform, NativeModules } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const { GRDBManager } = NativeModules;

interface DatabaseResult {
  rows: any[];
  rowsAffected: number;
  insertId: number;
}

let isDatabaseInitialized = false;
let dbInstance: SQLite.SQLiteDatabase | null = null;

SQLite.enablePromise(true);

// Android: Using react-native-sqlite-storage
export async function openDB() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabase({
      name: 'quran_arabic.db',
      createFromLocation: 1,
    });
  }
  return dbInstance;
}

// iOS: Using GRDB
export async function openDBIOS(): Promise<boolean> {
  if (isDatabaseInitialized) {
    return true;
  }

  try {
    await GRDBManager.openDatabase();
    isDatabaseInitialized = true;
    console.log('✅ iOS Database opened successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to open iOS database:', error);
    throw error;
  }
}

// Unified executeQuery function
export async function executeQuery(
  query: string,
  parameters: Record<string, any> = {},
): Promise<DatabaseResult> {
  if (Platform.OS === 'ios') {
    await openDBIOS();
    return await GRDBManager.executeQuery(query, parameters);
  } else {
    const db = await openDB();
    const paramsArray = Object.values(parameters);
    const [results] = await db.executeSql(query, paramsArray);

    const rows = [];
    for (let i = 0; i < results.rows.length; i++) {
      rows.push(results.rows.item(i));
    }

    return {
      rows,
      rowsAffected: results.rowsAffected,
      insertId: results.insertId,
    };
  }
}

// Helper to convert parameters for different platforms
export function prepareParameters(
  parameters: any[] | Record<string, any>,
): Record<string, any> {
  if (Array.isArray(parameters)) {
    const result: Record<string, any> = {};
    parameters.forEach((value, index) => {
      result[`param${index}`] = value;
    });
    return result;
  }
  return parameters;
}
