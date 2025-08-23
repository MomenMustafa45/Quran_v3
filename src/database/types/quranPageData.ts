import { QuranLineType } from './quranLine';
import { QuranWordType } from './quranWord';

export type QuranPageData = {
  lines: { line: QuranLineType; words: QuranWordType[] }[];
  surah: string;
};

// page_id	page_number	juz_id	surah_name
export type QuranMenuPageType = {
  page_id: number;
  page_number: number;
  juz_id: number;
  surah_name: string;
};
