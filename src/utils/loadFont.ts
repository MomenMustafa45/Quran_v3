import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export const loadFont = async () => {
  console.log('🚀 Loading Uthmani Hafs font...');

  let fontBase64 = '';

  if (Platform.OS === 'android') {
    // Copy from assets to DocumentDirectory
    const destPath = `${RNFS.DocumentDirectoryPath}/UthmanTNB_v2-0.ttf`;
    console.log('🚀 ~ loadFont ~ destPath:', destPath);

    try {
      const assetPath = 'fonts/UthmanTNB_v2-0.ttf';
      await RNFS.copyFileAssets(assetPath, destPath);
      fontBase64 = await RNFS.readFile(destPath, 'base64');
    } catch (err) {
      console.error('Error copying font from assets:', err);
    }
  } else {
    // iOS can read directly from MainBundlePath
    const fontPath = `${RNFS.MainBundlePath}/UthmanTNB_v2-0.ttf`;
    fontBase64 = await RNFS.readFile(fontPath, 'base64');
  }

  return fontBase64;
};
