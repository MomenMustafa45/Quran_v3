import { DocumentDirectoryPath, exists } from '@dr.pogodin/react-native-fs';

export type LocalAudioKind = 'word' | 'ayah';

export function getDownloadedAudioFileName(audioUrl: string): string | null {
  const fileName = audioUrl.split('/').pop();
  return fileName ?? null;
}

/** Matches files saved by `downloadPageAudios` (full URL filename). */
export function resolveLocalAudioPath(audioUrl: string): string | null {
  const fileName = getDownloadedAudioFileName(audioUrl);
  if (!fileName) {
    return null;
  }
  return `${DocumentDirectoryPath}/${fileName}`;
}

function resolveLegacyAyahAudioPath(audioUrl: string): string | null {
  const fileName = getDownloadedAudioFileName(audioUrl);
  if (!fileName) {
    return null;
  }
  const fileAyaName = `${fileName.split('_').slice(0, 2).join('')}.mp3`;
  return `${DocumentDirectoryPath}/${fileAyaName}`;
}

export async function resolvePlayableLocalAudioPath(
  audioUrl: string,
  kind: LocalAudioKind,
): Promise<string | null> {
  const primary = resolveLocalAudioPath(audioUrl);
  if (!primary) {
    return null;
  }

  if (await exists(primary)) {
    return primary;
  }

  if (kind === 'ayah') {
    const legacy = resolveLegacyAyahAudioPath(audioUrl);
    if (legacy && (await exists(legacy))) {
      return legacy;
    }
  }

  return primary;
}
