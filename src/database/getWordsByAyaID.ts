// wordService.ts
import { executeQuery } from './connection';

export const getWordsByAyaID = async (
  ayaId: number,
): Promise<{ word_id: number }[]> => {
  try {
    const result = await executeQuery(
      'SELECT word_id FROM Words WHERE ayat_id = ?',
      [ayaId],
    );

    console.log('🚀 ~ getWordsByAyaID ~ words:', result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error fetching words by Aya ID:', error);
    return [];
  }
};
