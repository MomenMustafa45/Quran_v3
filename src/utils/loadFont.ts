import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export const loadFont = async () => {
  let fontBase64 = '';

  if (Platform.OS === 'android') {
    // Copy from assets to DocumentDirectory
    const destPath = `${RNFS.DocumentDirectoryPath}/Uthmanic-HAFS.otf`;

    try {
      const assetPath = 'fonts/Uthmanic-HAFS.otf';
      await RNFS.copyFileAssets(assetPath, destPath);
      fontBase64 = await RNFS.readFile(destPath, 'base64');
    } catch (err) {
      console.error('Error copying font from assets:', err);
    }
  } else {
    // iOS can read directly from MainBundlePath
    const fontPath = `${RNFS.MainBundlePath}/Uthmanic-HAFS.otf`;
    fontBase64 = await RNFS.readFile(fontPath, 'base64');
  }

  return fontBase64;
};
