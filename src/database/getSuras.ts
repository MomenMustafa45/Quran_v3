import { openDB } from './connection';
import { mapRowsToArray } from './helpers/mapRowsToArray';
import { QuranSuraType } from './types/quranSuras';

export const getSuras = async () => {
  const db = await openDB();

  const [results] = await db.executeSql(`SELECT * FROM Suras`);

  const suras = mapRowsToArray<QuranSuraType>(results.rows);

  return suras;
};
