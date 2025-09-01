import RNFS from 'react-native-fs';
import { openDB } from './connection';
import Toast from 'react-native-toast-message';
import { getItem, setItem } from '../../storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const downloadPageAudios = async (
  pageId: number,
  onProgress?: (progress: number) => void,
) => {
  try {
    const db = await openDB();

    // Fetch all unique URLs from Ayats + Words
    const [result] = await db.executeSql(
      `
        SELECT audio_url FROM Ayats WHERE page_id = ?
        UNION
        SELECT audio_url FROM Words WHERE page_number = ?
      `,
      [pageId, pageId],
    );

    const urlsSet = new Set<string>();
    for (let i = 0; i < result.rows.length; i++) {
      const url = result.rows.item(i).audio_url;
      if (url) urlsSet.add(url);
    }

    const urls = Array.from(urlsSet);
    const totalFiles = urls.length;
    let finishedFiles = 0;

    const concurrencyLimit = 2; // lower to reduce server throttling
    let activeDownloads: Promise<void>[] = [];

    // Retry logic for downloads
    const downloadWithRetry = async (
      url: string,
      retries = 3,
    ): Promise<void> => {
      let attempt = 0;
      while (attempt < retries) {
        try {
          const fileName = url.split('/').pop();
          const dest = RNFS.DocumentDirectoryPath + '/' + fileName;

          // Skip if already downloaded
          const exists = await RNFS.exists(dest);
          if (exists) {
            finishedFiles++;
            onProgress?.((finishedFiles / totalFiles) * 100);
            return;
          }

          // Attempt download
          await RNFS.downloadFile({
            fromUrl: url,
            toFile: dest,
            progressDivider: 5,
          }).promise;

          finishedFiles++;
          onProgress?.((finishedFiles / totalFiles) * 100);
          return;
        } catch (err) {
          console.log('retrying', attempt, url);

          attempt++;
          if (attempt >= retries) {
            const errorMessage =
              (err instanceof Error && err.message) ||
              'Something went wrong while downloading audio.';
            Toast.show({
              type: 'error',
              text1: 'Download failed',
              text2: errorMessage,
            });
            console.error('Download error', url, err);
            onProgress?.(0);
            return;
          }
          // Wait before retrying (exponential backoff: 1s, 2s, 4s…)
          await new Promise(res =>
            setTimeout(res, 1000 * Math.pow(2, attempt)),
          );
        }
      }
    };

    // Controlled concurrency loop
    for (const url of urls) {
      if (!url) continue;

      const downloadPromise = downloadWithRetry(url);
      activeDownloads.push(downloadPromise);

      if (activeDownloads.length >= concurrencyLimit) {
        await Promise.race(activeDownloads);
        activeDownloads = activeDownloads.filter(
          p => p !== Promise.race(activeDownloads),
        );
      }
    }

    await Promise.all(activeDownloads);

    // save downloaded pages in storage
    const storedDownloadedPages = getItem(
      STORAGE_KEYS.DOWNLOADED_PAGES,
    ) as string;
    let downloadedPagesParsed: Record<number, true> = {};

    if (storedDownloadedPages) {
      downloadedPagesParsed = JSON.parse(storedDownloadedPages);
    }

    downloadedPagesParsed[pageId] = true;

    setItem(
      STORAGE_KEYS.DOWNLOADED_PAGES,
      JSON.stringify(downloadedPagesParsed),
    );
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
