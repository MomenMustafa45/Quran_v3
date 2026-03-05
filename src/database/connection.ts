import { NativeModules } from 'react-native';

const { GRDBManager } = NativeModules;

let dbOpened = false;

export async function openDB() {
  await GRDBManager.openDatabase();
}

export async function executeQuery(query: string, parameters: any = {}) {
  if (!dbOpened) {
    await openDB();
  }

  const iosParams: Record<string, any> = {};

  Object.values(parameters).forEach((value, index) => {
    iosParams[`param${index}`] = value;
  });

  return GRDBManager.executeQuery(query, iosParams);
}

export function prepareParameters(parameters: any[]) {
  const result: Record<string, any> = {};

  parameters.forEach((value, index) => {
    result[`param${index}`] = value;
  });

  return result;
}
