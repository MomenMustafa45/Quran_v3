// surahService.ts
import { executeQuery, prepareParameters } from './connection';

export async function getSurahNameById(
  surahId: number,
): Promise<string | null> {
  const parametersPageId = prepareParameters([surahId]);

  const result = await executeQuery(
    'SELECT name_arabic FROM suras WHERE sura_id = ? LIMIT 1',
    parametersPageId,
  );

  return result.rows[0]?.name_arabic || null;
}
