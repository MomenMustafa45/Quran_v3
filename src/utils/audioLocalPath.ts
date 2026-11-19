import { DocumentDirectoryPath, exists } from '@dr.pogodin/react-native-fs';

export type LocalAudioKind = 'word' | 'ayah';

/** downloadPageAudios saves each file under its URL's last path segment. */
function getDownloadedAudioFileName(audioUrl: string): string | null {
  const fileName = audioUrl.split('/').pop();
  return fileName || null;
}

// Word audio is ".../wbw/SSS_AAA_WWW.mp3" (surah_ayah_word); the matching
// ayah recitation is saved by downloadPageAudios as "SSSAAA.mp3".
const WORD_AUDIO_FILE_PATTERN = /^(\d{3})_(\d{3})_\d+\.mp3$/;

/**
 * Local file to play for `audioUrl`.
 * - kind 'word': the URL's own file.
 * - kind 'ayah': if given a word URL (a word tapped in ayah mode), the
 *   ayah file derived from it; if given an ayah URL (page playback), that
 *   file. The word file must never be used here: once a page is downloaded
 *   it always exists, and ayah mode would silently play the single word.
 */
function resolveTargetFileName(
  audioUrl: string,
  kind: LocalAudioKind,
): string | null {
  const fileName = getDownloadedAudioFileName(audioUrl);
  if (!fileName) {
    return null;
  }

  if (kind === 'ayah') {
    const wordMatch = WORD_AUDIO_FILE_PATTERN.exec(fileName);
    if (wordMatch) {
      return `${wordMatch[1]}${wordMatch[2]}.mp3`;
    }
  }

  return fileName;
}

export type ResolvedLocalAudio = {
  path: string;
  /** Whether the file is already on disk (callers can skip their own check). */
  exists: boolean;
};

export async function resolvePlayableLocalAudioPath(
  audioUrl: string,
  kind: LocalAudioKind,
): Promise<ResolvedLocalAudio | null> {
  const fileName = resolveTargetFileName(audioUrl, kind);
  if (!fileName) {
    return null;
  }

  const path = `${DocumentDirectoryPath}/${fileName}`;
  return { path, exists: await exists(path) };
}
