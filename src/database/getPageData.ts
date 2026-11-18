import { executeQuery, prepareParameters } from './connection';
import { QuranLineType } from './types/quranLine';
import { QuranWordType } from './types/quranWord';
import {
  getCachedPageData,
  setCachedPageData,
} from './pageDataCache';

export interface PageDataResult {
  surah: string;
  lines: Array<{
    line: QuranLineType;
    words: QuranWordType[];
  }>;
}

function groupWordsByLine(
  lines: QuranLineType[],
  words: QuranWordType[],
): PageDataResult['lines'] {
  return lines.map(line => ({
    line,
    words: words.filter(
      word =>
        word.word_id >= line.first_word_id &&
        word.word_id <= line.last_word_id,
    ),
  }));
}

async function fetchPageDataFromDb(pageId: number): Promise<PageDataResult> {
  const parametersPageId = prepareParameters([pageId]);

  const lineResult = await executeQuery(
    `SELECT * FROM Lines WHERE page_id = ? ORDER BY line_number;`,
    parametersPageId,
  );

  if (lineResult.rows.length === 0) {
    return { surah: '', lines: [] };
  }

  const lines = lineResult.rows as QuranLineType[];

  const parametersSuraId = prepareParameters([lines[0].sura_id]);
  const suraResult = await executeQuery(
    `SELECT name_arabic FROM suras WHERE sura_id = ?;`,
    parametersSuraId,
  );

  const surahName: string = suraResult.rows[0]?.name_arabic || '';

  const minWordId = Math.min(...lines.map(line => line.first_word_id));
  const maxWordId = Math.max(...lines.map(line => line.last_word_id));

  const wordResult = await executeQuery(
    `SELECT * FROM Words WHERE word_id BETWEEN ? AND ? ORDER BY word_id;`,
    prepareParameters([minWordId, maxWordId]),
  );

  const words = wordResult.rows as QuranWordType[];

  return {
    surah: surahName,
    lines: groupWordsByLine(lines, words),
  };
}

export async function getPageData(pageId: number): Promise<PageDataResult> {
  const cached = getCachedPageData(pageId);
  if (cached) {
    return cached;
  }

  const result = await fetchPageDataFromDb(pageId);
  setCachedPageData(pageId, result);
  return result;
}
