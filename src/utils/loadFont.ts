import { Platform } from 'react-native';
import {
  copyFileAssets,
  DocumentDirectoryPath,
  exists,
  MainBundlePath,
  readFile,
} from '@dr.pogodin/react-native-fs';
import { LruCache } from './lruCache';

// Each page font is ~150 KB on disk (~200 KB as base64). Keep only the pages
// around the reader in memory; an unbounded cache grows to ~120 MB after a
// full read-through.
const MAX_CACHED_FONTS = 15;
const fontBase64Cache = new LruCache<number, string>(MAX_CACHED_FONTS);

const formatPageId = (pageId: number) => {
  return String(pageId).padStart(3, '0');
};

export const loadFont = async (
  pageNumber: number,
): Promise<string | undefined> => {
  const cached = fontBase64Cache.get(pageNumber);
  if (cached) {
    return cached;
  }

  try {
    let fontBase64 = '';

    if (Platform.OS === 'android') {
      const destPath = `${DocumentDirectoryPath}/${formatPageId(
        pageNumber,
      )}.ttf`;

      const destExists = await exists(destPath);
      if (!destExists) {
        const assetPath = `fonts/${formatPageId(pageNumber)}.ttf`;
        await copyFileAssets(assetPath, destPath);
      }

      fontBase64 = await readFile(destPath, 'base64');
    } else {
      const fontPath = `${MainBundlePath}/${formatPageId(pageNumber)}.ttf`;
      fontBase64 = await readFile(fontPath, 'base64');
    }

    if (fontBase64) {
      fontBase64Cache.set(pageNumber, fontBase64);
    }

    return fontBase64;
  } catch (error) {
    console.log('error from font', error);
    return undefined;
  }
};
