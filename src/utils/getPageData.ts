import SQLite from 'react-native-sqlite-storage';
import { QuranLineType } from '../types/quranLine';
import { QuranWordType } from '../types/quranWord';

SQLite.enablePromise(true);

let dbInstance = null;

export async function openDB() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabase({
      name: 'quran_arabic.db',
      createFromLocation: 1,
    });
  }
  return dbInstance;
}

export async function getPageData(pageId: number) {
  const db = await openDB();

  // Get all lines of the page
  const [lineResults] = await db.executeSql(
    `SELECT * FROM Lines WHERE page_id = ? ORDER BY line_number;`,
    [pageId],
  );

  if (lineResults.rows.length === 0) {
    return { surah: '', lines: [] };
  }

  // Get surah name from first line
  const surahId = lineResults.rows.item(0).sura_id;
  const [suraResults] = await db.executeSql(
    `SELECT name_arabic FROM Suras WHERE sura_id = ?;`,
    [surahId],
  );
  const surahName: string = suraResults.rows.item(0)?.name_arabic || '';

  // Prepare lines with words
  const lines = [];
  for (let i = 0; i < lineResults.rows.length; i++) {
    const line: QuranLineType = lineResults.rows.item(i);

    // Get words for this line
    const [wordResults] = await db.executeSql(
      `SELECT * FROM Words
       WHERE word_id BETWEEN ? AND ?
       ORDER BY word_id;`,
      [line.first_word_id, line.last_word_id],
    );

    const words: QuranWordType[] = [];
    for (let j = 0; j < wordResults.rows.length; j++) {
      words.push(wordResults.rows.item(j));
    }

    lines.push({
      line: line,
      words,
    });
  }

  return { surah: surahName, lines };
}
