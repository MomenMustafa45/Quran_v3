// juzService.ts
import { executeQuery } from './connection';
import { QuranJuzType } from './types/qraunJuz';

export const getJuzs = async (): Promise<QuranJuzType[]> => {
  const result = await executeQuery('SELECT * FROM Juzs');
  return result.rows;
};
