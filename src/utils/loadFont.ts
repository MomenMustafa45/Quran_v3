import { Platform } from 'react-native';
import {
  DocumentDirectoryPath,
  MainBundlePath,
  readDir,
  readFile,
  readFileAssets,
  unlink,
} from '@dr.pogodin/react-native-fs';
import { LruCache } from './lruCache';
import { getBooleanItem, setItem } from '../../storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

// Each page font is ~150 KB on disk (~200 KB as base64). Keep only the pages
// around the reader in memory; an unbounded cache grows to ~120 MB after a
// full read-through.
const MAX_CACHED_FONTS = 15;
const fontBase64Cache = new LruCache<number, string>(MAX_CACHED_FONTS);

// Matches the per-page font copies older versions wrote to DocumentDirectory
// (e.g. "001.ttf"). Audio files there are never matched.
const LEGACY_FONT_COPY_PATTERN = /^\d{3}\.ttf$/;

const formatPageId = (pageId: number) => {
  return String(pageId).padStart(3, '0');
};

// Concurrent loads of the same page font share one native read.
const inFlight = new Map<number, Promise<string | undefined>>();

export const loadFont = (pageNumber: number): Promise<string | undefined> => {
  const cached = fontBase64Cache.get(pageNumber);
  if (cached) {
    return Promise.resolve(cached);
  }

  const pending = inFlight.get(pageNumber);
  if (pending) {
    return pending;
  }

  const request = readFontBase64(pageNumber).finally(() => {
    inFlight.delete(pageNumber);
  });
  inFlight.set(pageNumber, request);
  return request;
};

const readFontBase64 = async (
  pageNumber: number,
): Promise<string | undefined> => {
  try {
    const fileName = `${formatPageId(pageNumber)}.ttf`;

    // Android reads straight from the APK assets; iOS from the app bundle.
    const fontBase64 =
      Platform.OS === 'android'
        ? await readFileAssets(`fonts/${fileName}`, 'base64')
        : await readFile(`${MainBundlePath}/${fileName}`, 'base64');

    if (fontBase64) {
      fontBase64Cache.set(pageNumber, fontBase64);
    }

    return fontBase64;
  } catch (error) {
    console.log('error from font', error);
    return undefined;
  }
};

/**
 * Older Android builds copied every opened page font into DocumentDirectory
 * (up to ~89 MB). Fonts are now read from assets, so delete those copies once.
 */
export async function cleanupLegacyFontCopies(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  if (getBooleanItem(STORAGE_KEYS.LEGACY_FONTS_CLEANED)) {
    return;
  }

  try {
    const entries = await readDir(DocumentDirectoryPath);
    await Promise.all(
      entries
        .filter(
          entry => entry.isFile() && LEGACY_FONT_COPY_PATTERN.test(entry.name),
        )
        .map(entry => unlink(entry.path).catch(() => undefined)),
    );
    setItem(STORAGE_KEYS.LEGACY_FONTS_CLEANED, true);
  } catch (error) {
    console.log('error cleaning legacy font copies', error);
  }
}
