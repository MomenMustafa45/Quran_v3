import { openDB } from './connection';
import { mapRowsToArray } from './helpers/mapRowsToArray';
import { QuranMenuPageType } from './types/quranPageData';

export const getPages = async () => {
  const db = await openDB();
  const [results] = await db.executeSql(`SELECT * FROM Pages`);

  const pages: QuranMenuPageType[] = mapRowsToArray(results.rows);
  return pages;
};
