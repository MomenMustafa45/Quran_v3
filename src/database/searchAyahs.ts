// searchService.ts
import { executeQuery } from './connection';
import { QuranAyahType } from './types/quranAyah';

export type AyahType = {
  audio_url: string;
  ayat_id: number;
  sura_id: number;
  ayat_number: number;
  text_uthmani: string;
  page_id: number;
};

export const searchAyats = async (query: string): Promise<QuranAyahType[]> => {
  try {
    if (!query.trim()) return [];

    const result = await executeQuery(
      `SELECT * FROM Ayats WHERE text_arabic LIKE ?`,
      [`%${query}%`],
    );

    return result.rows;
  } catch (error) {
    console.log('🚀 ~ searchAyats ~ error:', error);
    return [];
  }
};
