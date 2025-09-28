// pageService.ts
import { executeQuery } from './connection';
import { QuranMenuPageType } from './types/quranPageData';

export const getPages = async (): Promise<QuranMenuPageType[]> => {
  const result = await executeQuery('SELECT * FROM Pages');
  return result.rows;
};
