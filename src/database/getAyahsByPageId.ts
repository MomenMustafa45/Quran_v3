// ayahService.ts
import { executeQuery, prepareParameters } from './connection';
import { AyahType } from './searchAyahs';

export const getAyahsByPageId = async (pageId: number): Promise<AyahType[]> => {
  try {
    const parameters = prepareParameters([pageId]);
    const result = await executeQuery(
      'SELECT * FROM Ayats WHERE page_id = ? ORDER BY ayat_id;',
      parameters,
    );

    return result.rows;
  } catch (error) {
    console.error('Error fetching ayahs by page ID:', error);
    return [];
  }
};
