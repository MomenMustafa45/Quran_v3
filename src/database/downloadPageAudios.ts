import RNFS from 'react-native-fs';
import { openDB } from './connection';

export const downloadPageAudios = async (pageId: number) => {
  try {
    const db = await openDB();

    // Single query to fetch all audio URLs from both tables
    const [result] = await db.executeSql(
      `
        SELECT audio_url FROM Ayats WHERE page_id = ?
        UNION
        SELECT audio_url FROM Words WHERE page_number = ?
        `,
      [pageId, pageId],
    );

    const urls: string[] = [];

    // Convert result to array and remove duplicates
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      urls.push(row.audio_url);
    }

    // Limit concurrent downloads for better performance
    const concurrencyLimit = 5;
    let activeDownloads: Promise<void | RNFS.DownloadResult>[] = [];

    for (const url of urls) {
      if (!url) continue; // Skip empty URLs
      const fileName = url.split('/').pop();
      const dest = RNFS.DocumentDirectoryPath + '/' + fileName;

      const exists = await RNFS.exists(dest);
      if (!exists) {
        const downloadPromise = RNFS.downloadFile({
          fromUrl: url,
          toFile: dest,
        }).promise.catch(err => {
          console.error('Failed downloading', fileName, err);
        });

        activeDownloads.push(downloadPromise);

        // If we hit the concurrency limit, wait for one to finish
        if (activeDownloads.length >= concurrencyLimit) {
          // Wait for one download to finish
          await Promise.race(activeDownloads);
          // Remove settled promises by filtering out those that have resolved
          activeDownloads = activeDownloads.filter(
            p => p !== Promise.race(activeDownloads),
          );
        }
      }
    }

    // Wait for any remaining downloads
    await Promise.all(activeDownloads);

    console.log('✅ All audio files downloaded for page', pageId);
  } catch (err) {
    console.error('❌ Download error:', err);
  }
};
