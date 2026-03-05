import { NativeModules } from 'react-native';

const { GRDBManager } = NativeModules;

interface DatabaseResult {
  rows: any[];
  rowsAffected: number;
  insertId: number;
}

let dbOpen = false;

// iOS: Using GRDB, Android: Using custom GRDBManager
export async function openDB() {
  await GRDBManager.openDatabase();
}

// Unified executeQuery function
export async function executeQuery(
  query: string,
  parameters: Record<string, any> = {},
): Promise<DatabaseResult> {
  if (!dbOpen) {
    await openDB();
    dbOpen = true;
  }

  // iOS expects numbered params like param0, param1, etc.
  // Android expects the same format for consistency
  const iosParams: Record<string, any> = {};
  Object.values(parameters).forEach((value, index) => {
    iosParams[`param${index}`] = value;
  });

  return await GRDBManager.executeQuery(query, iosParams);
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

// Close database if needed
export async function closeDatabase(): Promise<boolean> {
  try {
    await GRDBManager.closeDatabase();
    return true;
  } catch (error) {
    console.error('❌ Failed to close database:', error);
    return false;
  }
}

// Check if database is open
export async function isDatabaseOpen(): Promise<boolean> {
  return await GRDBManager.isDatabaseOpen();
}
