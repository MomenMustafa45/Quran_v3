import type { QuranPageData } from './types/quranPageData';

const MAX_CACHED_PAGES = 15;
const pageDataCache = new Map<number, QuranPageData>();

export function getCachedPageData(pageId: number): QuranPageData | undefined {
  return pageDataCache.get(pageId);
}

export function setCachedPageData(pageId: number, data: QuranPageData): void {
  if (pageDataCache.has(pageId)) {
    pageDataCache.delete(pageId);
  }
  pageDataCache.set(pageId, data);

  if (pageDataCache.size > MAX_CACHED_PAGES) {
    const oldestKey = pageDataCache.keys().next().value;
    if (oldestKey !== undefined) {
      pageDataCache.delete(oldestKey);
    }
  }
}

export function clearPageDataCache(): void {
  pageDataCache.clear();
}
