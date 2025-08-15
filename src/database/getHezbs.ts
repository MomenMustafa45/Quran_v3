import { openDB } from './connection';
import { mapRowsToArray } from './helpers/mapRowsToArray';
import { QuranHezbType } from './types/quranHezb';

export const getHezbs = async () => {
  const db = await openDB();
  const [results] = await db.executeSql(`SELECT * FROM Hezbs`);

  const hezbs: QuranHezbType[] = mapRowsToArray(results.rows);
  return hezbs;
};
