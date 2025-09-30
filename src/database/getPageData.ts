// pageDataService.ts
import { executeQuery, prepareParameters } from './connection';
import { QuranLineType } from './types/quranLine';
import { QuranWordType } from './types/quranWord';

export interface PageDataResult {
  surah: string;
  lines: Array<{
    line: QuranLineType;
    words: QuranWordType[];
  }>;
}

export async function getPageData(pageId: number): Promise<PageDataResult> {
  // Get all lines of the page

  const parametersPageId = prepareParameters([pageId]);

  const lineResult = await executeQuery(
    `SELECT * FROM Lines WHERE page_id = ? ORDER BY line_number;`,
    parametersPageId,
  );

  if (lineResult.rows.length === 0) {
    return { surah: '', lines: [] };
  }

  const parametersSuraId = prepareParameters([lineResult.rows[0].sura_id]);
  // Get surah name from first line
  const suraResult = await executeQuery(
    `SELECT name_arabic FROM suras WHERE sura_id = ?;`,
    parametersSuraId,
  );

  const surahName: string = suraResult.rows[0]?.name_arabic || '';

  // Prepare lines with words
  const lines = [];
  for (const line of lineResult.rows) {
    const parametersLineWords = prepareParameters([
      line.first_word_id,
      line.last_word_id,
    ]);
    // Get words for this line
    const wordResult = await executeQuery(
      `SELECT * FROM Words
       WHERE word_id BETWEEN ? AND ?
       ORDER BY word_id;`,
      parametersLineWords,
    );

    lines.push({
      line: line,
      words: wordResult.rows,
    });
  }

  return { surah: surahName, lines };
}
