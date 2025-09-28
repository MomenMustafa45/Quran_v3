// suraService.ts
import { executeQuery } from './connection';
import { QuranSuraType } from './types/quranSuras';

export const getSuras = async (): Promise<QuranSuraType[]> => {
  const result = await executeQuery('SELECT * FROM suras');
  return result.rows;
};
