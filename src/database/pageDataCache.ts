import type { QuranPageData } from './types/quranPageData';
import { LruCache } from '../utils/lruCache';

const MAX_CACHED_PAGES = 15;
const pageDataCache = new LruCache<number, QuranPageData>(MAX_CACHED_PAGES);

export function getCachedPageData(pageId: number): QuranPageData | undefined {
  return pageDataCache.get(pageId);
}

export function setCachedPageData(pageId: number, data: QuranPageData): void {
  pageDataCache.set(pageId, data);
}
