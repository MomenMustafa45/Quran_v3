import { QuranLineType } from './quranLine';
import { QuranWordType } from './quranWord';

export type QuranPageData = {
  lines: { line: QuranLineType; words: QuranWordType[] }[];
  surah: string;
};
