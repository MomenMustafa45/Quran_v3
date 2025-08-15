import { openDB } from './connection';
import { mapRowsToArray } from './helpers/mapRowsToArray';
import { QuranJuzType } from './types/qraunJuz';

export const getJuzs = async () => {
  const db = await openDB();

  const [results] = await db.executeSql(`SELECT * FROM Juzs`);

  const juzs = mapRowsToArray<QuranJuzType>(results.rows);

  return juzs;
};
