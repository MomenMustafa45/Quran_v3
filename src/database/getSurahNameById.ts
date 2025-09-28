// surahService.ts
import { executeQuery } from './connection';

export async function getSurahNameById(
  surahId: number,
): Promise<string | null> {
  const result = await executeQuery(
    'SELECT name_arabic FROM suras WHERE sura_id = ? LIMIT 1',
    [surahId],
  );

  return result.rows[0]?.name_arabic || null;
}
