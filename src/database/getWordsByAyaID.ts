import { openDB } from './connection';
import { mapRowsToArray } from './helpers/mapRowsToArray';

export const getWordsByAyaID = async (ayaId: number) => {
  try {
    const db = await openDB();
    const [result] = await db.executeSql(
      'SELECT word_id FROM Words WHERE ayat_id = ?',
      [ayaId],
    );
    const words: { word_id: number }[] = mapRowsToArray(result.rows);
    console.log('🚀 ~ getWordsByAyaID ~ words:', words);
    return words;
  } catch (error) {
    console.error('Error fetching words by Aya ID:', error);
    return [];
  }
};
