// downloadAudioService.ts
import {
  downloadFile,
  exists,
  DocumentDirectoryPath,
} from '@dr.pogodin/react-native-fs';
import { executeQuery, prepareParameters } from './connection';
import Toast from 'react-native-toast-message';
import { getItem, setItem } from '../../storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

const TOTAL_QURAN_PAGES = 604;
const CONCURRENCY_LIMIT = 3;
const MAX_RETRIES = 2;

/**
 * Runs `worker` over `items` with at most `limit` running concurrently.
 * Uses a Set so completed promises are removed correctly (fixes the
 * old Promise.race/filter bug, which never actually removed anything).
 */
async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  const executing = new Set<Promise<void>>();

  for (const item of items) {
    const p = worker(item).finally(() => executing.delete(p));
    executing.add(p);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
}

/**
 * Downloads a single audio file with exponential-backoff retries.
 * Returns true on success (or if the file already exists), false if
 * it ultimately failed after all retries.
 */
async function downloadWithRetry(
  url: string,
  onFileDone: () => void,
  retries = MAX_RETRIES,
): Promise<boolean> {
  const fileName = url.split('/').pop();

  if (!fileName) {
    console.warn('Skipping invalid audio URL:', url);
    onFileDone();
    return false;
  }

  const dest = `${DocumentDirectoryPath}/${fileName}`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (await exists(dest)) {
        onFileDone();
        return true;
      }

      await downloadFile({
        fromUrl: url,
        toFile: dest,
        progressDivider: 5,
      }).promise;

      onFileDone();
      return true;
    } catch (err) {
      const isLastAttempt = attempt === retries - 1;
      console.log(`retrying (${attempt + 1}/${retries})`, url);

      if (isLastAttempt) {
        const errorMessage =
          (err instanceof Error && err.message) ||
          'Something went wrong while downloading audio.';
        Toast.show({
          type: 'error',
          text1: 'Download failed',
          text2: errorMessage,
        });
        console.error('Download error', url, err);
        onFileDone();
        return false;
      }

      await new Promise(res =>
        setTimeout(() => {
          res(true);
        }, 1000 * 2 ** (attempt + 1)),
      );
    }
  }

  return false;
}

function markPageAsDownloaded(pageId: number) {
  const stored = getItem(STORAGE_KEYS.DOWNLOADED_PAGES) as string | undefined;
  const downloadedPages: Record<number, true> = stored
    ? JSON.parse(stored)
    : {};

  downloadedPages[pageId] = true;
  setItem(STORAGE_KEYS.DOWNLOADED_PAGES, JSON.stringify(downloadedPages));
}

/**
 * Fetches all unique audio URLs for a page (Ayats + Words) and downloads
 * them with limited concurrency and retries. Only marks the page as
 * downloaded in storage if every file succeeded.
 */
export const downloadPageAudios = async (
  pageId: number,
  onProgress?: (progress: number) => void,
): Promise<boolean> => {
  try {
    const urlsParameters = prepareParameters([pageId, pageId]);

    const result = await executeQuery(
      `
      SELECT audio_url FROM Ayats WHERE page_id = ?
      UNION
      SELECT audio_url FROM Words WHERE page_number = ?
      `,
      urlsParameters,
    );

    const urls = [];

    for (const row of result.rows) {
      if (row.audio_url) {
        urls.push(row.audio_url);
      }
    }

    // const urls = Array.from(
    //   new Set<string>(
    //     result.rows
    //       .map((row: any) => row.audio_url)
    //       .filter((url: string | null | undefined): url is string => !!url),
    //   ),
    // );

    const totalFiles = urls.length;

    if (totalFiles === 0) {
      onProgress?.(100);
      markPageAsDownloaded(pageId);
      return true;
    }

    let finishedFiles = 0;
    let allSucceeded = true;

    const onFileDone = () => {
      finishedFiles++;
      onProgress?.((finishedFiles / totalFiles) * 100);
    };

    await runWithConcurrency(urls, CONCURRENCY_LIMIT, async url => {
      const success = await downloadWithRetry(url, onFileDone);
      if (!success) allSucceeded = false;
    });

    if (allSucceeded) {
      markPageAsDownloaded(pageId);
      console.log('✅ All files downloaded for page', pageId);
    } else {
      console.warn('⚠️ Some files failed for page', pageId);
    }

    return allSucceeded;
  } catch (err) {
    console.error('❌ Download error:', err);
    return false;
  }
};

export const downloadAllQuranPages = async (
  onProgress: (progress: number) => void,
  onError: (msg: string) => void,
) => {
  try {
    let completed = 0;

    for (let pageId = 1; pageId <= TOTAL_QURAN_PAGES; pageId++) {
      try {
        await downloadPageAudios(pageId);
      } catch (err: any) {
        onError(err?.message || `Error on page ${pageId}`);
      } finally {
        completed++;
        onProgress((completed / TOTAL_QURAN_PAGES) * 100);
      }
    }

    onProgress(100);
  } catch (err: any) {
    onError(err?.message || 'Unexpected error while downloading all pages');
  }
};
