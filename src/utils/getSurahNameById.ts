import { openDB } from './getPageData';

export async function getSurahNameById(
  surahId: number,
): Promise<string | null> {
  const db = await openDB();
  const [results] = await db.executeSql(
    'SELECT name_arabic FROM Suras WHERE sura_id = ? LIMIT 1',
    [surahId],
  );
  console.log(
    '🚀 ~ getSurahNameById ~ results:',
    results.rows.item(0).name_arabic,
  );

  return results.rows.item(0).name_arabic || '';
}
