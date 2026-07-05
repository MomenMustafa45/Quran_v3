import { Platform } from 'react-native';
import {
  copyFileAssets,
  DocumentDirectoryPath,
  MainBundlePath,
  readFile,
} from '@dr.pogodin/react-native-fs';

const formatPageId = (pageId: number) => {
  return String(pageId).padStart(3, '0');
};

export const loadFont = async (pageNumber: number) => {
  try {
    let fontBase64 = '';

    if (Platform.OS === 'android') {
      // Copy from assets to DocumentDirectory
      const destPath = `${DocumentDirectoryPath}/${formatPageId(
        pageNumber,
      )}.ttf`;

      try {
        const assetPath = `fonts/${formatPageId(pageNumber)}.ttf`;
        await copyFileAssets(assetPath, destPath);
        fontBase64 = await readFile(destPath, 'base64');
      } catch (err) {
        console.error('Error copying font from assets:', err);
      }
    } else {
      // iOS can read directly from MainBundlePath
      const fontPath = `${MainBundlePath}/${formatPageId(pageNumber)}.ttf`;

      fontBase64 = await readFile(fontPath, 'base64');
    }

    return fontBase64;
  } catch (error) {
    console.log('error from font', error);
  }
};
