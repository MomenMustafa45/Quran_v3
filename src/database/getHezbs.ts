// hezbService.ts
import { executeQuery } from './connection';
import { QuranHezbType } from './types/quranHezb';

export const getHezbs = async (): Promise<QuranHezbType[]> => {
  const result = await executeQuery('SELECT * FROM Hezbs');
  return result.rows;
};
