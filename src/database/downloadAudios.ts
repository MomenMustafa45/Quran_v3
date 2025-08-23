import RNFS from 'react-native-fs';
import { openDB } from './connection';
import Toast from 'react-native-toast-message';

export const downloadPageAudios = async (
  pageId: number,
  onProgress?: (progress: number) => void,
) => {
  try {
    const db = await openDB();

    // Fetch all URLs
    const [result] = await db.executeSql(
      `
        SELECT audio_url FROM Ayats WHERE page_id = ?
        UNION
        SELECT audio_url FROM Words WHERE page_number = ?
      `,
      [pageId, pageId],
    );

    const urls: string[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      urls.push(result.rows.item(i).audio_url);
    }

    // Remove duplicates + empty
    const allUrls = urls.filter(Boolean);
    const totalFiles = allUrls.length;
    let finishedFiles = 0;

    const concurrencyLimit = 5;
    let activeDownloads: Promise<void>[] = [];

    const startDownload = async (url: string) => {
      try {
        const fileName = url.split('/').pop();
        const dest = RNFS.DocumentDirectoryPath + '/' + fileName;

        const exists = await RNFS.exists(dest);
        if (exists) {
          finishedFiles++;
          onProgress?.((finishedFiles / totalFiles) * 100);
          return;
        }

        await RNFS.downloadFile({
          fromUrl: url,
          toFile: dest,
          progress: () => {},
          progressDivider: 5, // Update every 5%
        }).promise;

        finishedFiles++;
        onProgress?.((finishedFiles / totalFiles) * 100);
      } catch (err) {
        const errorMessage =
          (err instanceof Error && err.message) ||
          'Something went wrong while downloading this page audio.';
        Toast.show({
          type: 'error',
          text1: 'Download failed',
          text2: errorMessage,
        });
        console.error('Download error', url, err);
        onProgress?.(0);
      }
    };

    for (const url of allUrls) {
      if (!url) continue;

      const downloadPromise = startDownload(url);
      activeDownloads.push(downloadPromise);

      if (activeDownloads.length >= concurrencyLimit) {
        await Promise.race(activeDownloads);
        activeDownloads = activeDownloads.filter(
          p => p !== Promise.race(activeDownloads),
        );
      }
    }

    await Promise.all(activeDownloads);
    console.log('✅ All files downloaded for page', pageId);
  } catch (err) {
    console.error('❌ Download error:', err);
  }
};

export const downloadAllQuranPages = async (
  onProgress: (progress: number) => void,
  onError: (msg: string) => void,
) => {
  try {
    const totalPages = 604;
    let completed = 0;

    for (let pageId = 1; pageId <= totalPages; pageId++) {
      try {
        await downloadPageAudios(pageId, () => {});
        completed++;
        onProgress((completed / totalPages) * 100);
      } catch (err: any) {
        onError(err.message || `Error on page ${pageId}`);
      }
    }

    onProgress(100);
  } catch (err: any) {
    onError(err.message || 'Unexpected error while downloading all pages');
  }
};
