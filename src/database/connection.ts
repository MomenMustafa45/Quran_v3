// database.ts
import GRDBManager from '../../specs/NativeGRDBManager';

let dbOpened = false;

export async function openDB() {
  await GRDBManager.openDatabase();
  dbOpened = true;
}

export async function executeQuery(query: string, parameters: any = {}) {
  if (!dbOpened) {
    await openDB();
  }

  const iosParams: Record<string, any> = {};
  Object.values(parameters).forEach((value, index) => {
    iosParams[`param${index}`] = value;
  });

  if (parameters['param0'] === null || parameters['param1'] === null) {
    return { insertId: -1, rowsAffected: 0, rows: [] };
  }

  return GRDBManager.executeQuery(query, iosParams) as Promise<{
    insertId: number;
    rowsAffected: number;
    rows: any[];
  }>;
}

export function prepareParameters(parameters: any[]) {
  const result: Record<string, any> = {};
  parameters.forEach((value, index) => {
    result[`param${index}`] = value;
  });
  return result;
}
