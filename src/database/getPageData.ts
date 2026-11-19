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

// surah_name and basmallah lines have NULL first/last_word_id; only ayah
// lines carry a word range.
const hasWordRange = (line: QuranLineType): boolean =>
  typeof line.first_word_id === 'number' &&
  typeof line.last_word_id === 'number';

function groupWordsByLine(
  lines: QuranLineType[],
  words: QuranWordType[],
): PageDataResult['lines'] {
  return lines.map(line => ({
    line,
    words: hasWordRange(line)
      ? words.filter(
          word =>
            word.word_id >= line.first_word_id &&
            word.word_id <= line.last_word_id,
        )
      : [],
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

  // Must ignore the NULL ranges of title/basmallah lines: Math.min(null, n)
  // is 0, which turned the query into "BETWEEN 0 AND max" and loaded every
  // word from the start of the Quran (~83k rows on page 600) for any page
  // that starts a surah.
  const ayahLines = lines.filter(hasWordRange);
  if (ayahLines.length === 0) {
    return { surah: surahName, lines: groupWordsByLine(lines, []) };
  }

  const minWordId = Math.min(...ayahLines.map(line => line.first_word_id));
  const maxWordId = Math.max(...ayahLines.map(line => line.last_word_id));

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

// Concurrent requests for the same page (e.g. a remount during the initial
// scrollToIndex) share one DB round-trip instead of each querying.
const inFlight = new Map<number, Promise<PageDataResult>>();

export function getPageData(pageId: number): Promise<PageDataResult> {
  const cached = getCachedPageData(pageId);
  if (cached) {
    return Promise.resolve(cached);
  }

  const pending = inFlight.get(pageId);
  if (pending) {
    return pending;
  }

  const request = fetchPageDataFromDb(pageId)
    .then(result => {
      setCachedPageData(pageId, result);
      return result;
    })
    .finally(() => {
      inFlight.delete(pageId);
    });

  inFlight.set(pageId, request);
  return request;
}
