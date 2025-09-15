import { openDB } from './connection';
import { mapRowsToArray } from './helpers/mapRowsToArray';
import { QuranAyahType } from './types/quranAyah';

export type AyahType = {
  audio_url: string;
  ayat_id: number;
  sura_id: number;
  ayat_number: number;
  text_uthmani: string;
  page_id: number;
};

export const searchAyats = async (query: string) => {
  if (!query.trim()) return [];

  const db = await openDB();

  // fetch a batch first (to avoid scanning all rows)
  const [results] = await db.executeSql(
    `SELECT * FROM Ayats WHERE text_arabic LIKE ?`,
    [`%${query}%`],
  );

  const ayats: QuranAyahType[] = mapRowsToArray<QuranAyahType>(results.rows);

  return ayats;
};
