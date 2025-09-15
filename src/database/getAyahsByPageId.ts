import { openDB } from './connection';
import { mapRowsToArray } from './helpers/mapRowsToArray';
import { AyahType } from './searchAyahs';

export const getAyahsByPageId = async (pageId: number) => {
  try {
    const db = await openDB();
    const [result] = await db.executeSql(
      'SELECT * FROM Ayats WHERE page_id = ? ORDER BY ayat_id;',
      [pageId],
    );
    const ayahs: AyahType[] = mapRowsToArray(result.rows);
    console.log('🚀 ~ getWordsByAyaID ~ words:', ayahs);
    return ayahs;
  } catch (error) {
    console.error('Error fetching words by Aya ID:', error);
    return [];
  }
};
