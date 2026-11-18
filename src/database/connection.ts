import GRDBManager from '../../specs/NativeGRDBManager';

let dbOpened = false;

export type SqlParameterValue = string | number | boolean | null;
export type SqlParameters = Record<string, SqlParameterValue>;

export type QueryResult = {
  insertId: number;
  rowsAffected: number;
  rows: any[];
};

export async function openDB() {
  await GRDBManager.openDatabase();
  dbOpened = true;
}

function normalizeParameters(
  parameters: SqlParameters | SqlParameterValue[],
): SqlParameters {
  if (Array.isArray(parameters)) {
    return prepareParameters(parameters);
  }
  return parameters;
}

export async function executeQuery(
  query: string,
  parameters: SqlParameters | SqlParameterValue[] = {},
): Promise<QueryResult> {
  if (!dbOpened) {
    await openDB();
  }

  const normalized = normalizeParameters(parameters);

  if (normalized.param0 === null || normalized.param1 === null) {
    return { insertId: -1, rowsAffected: 0, rows: [] };
  }

  return GRDBManager.executeQuery(query, normalized) as Promise<QueryResult>;
}

export function prepareParameters(
  parameters: SqlParameterValue[],
): SqlParameters {
  const result: SqlParameters = {};
  parameters.forEach((value, index) => {
    result[`param${index}`] = value;
  });
  return result;
}
