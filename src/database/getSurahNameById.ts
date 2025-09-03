import { openDB } from './connection';

export async function getSurahNameById(
  surahId: number,
): Promise<string | null> {
  const db = await openDB();
  const [results] = await db.executeSql(
    'SELECT name_arabic FROM suras WHERE sura_id = ? LIMIT 1',
    [surahId],
  );

  return results.rows.item(0).name_arabic || '';
}
