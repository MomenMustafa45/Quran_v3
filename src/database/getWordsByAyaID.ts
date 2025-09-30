// wordService.ts
import { executeQuery, prepareParameters } from './connection';

export const getWordsByAyaID = async (
  ayaId: number,
): Promise<{ word_id: number }[]> => {
  try {
    const parametersPageId = prepareParameters([ayaId]);

    const result = await executeQuery(
      'SELECT word_id FROM Words WHERE ayat_id = ?',
      parametersPageId,
    );

    return result.rows;
  } catch (error) {
    console.error('Error fetching words by Aya ID:', error);
    return [];
  }
};
