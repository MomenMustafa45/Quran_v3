import { useCallback, useRef, useState } from 'react';
import { getWordsByAyaID } from '../../../database/getWordsByAyaID';
import RNFS from 'react-native-fs';
import { downloadPageAudios } from '../../../database/downloadAudios';
import WebView from 'react-native-webview';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '../../../store/hooks/storeHooks';

type useQuranPageActionsProps = {
  pageId: number;
  playSound: (
    filePath: string,
    onFinished?: () => void,
    onStop?: () => void,
  ) => void;
};

const useQuranPageActions = ({
  pageId,
  playSound,
}: useQuranPageActionsProps) => {
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const soundType = useAppSelector(state => state.page.soundType);

  const webViewRef = useRef<WebView>(null);
  const isDownloadingRef = useRef(false);
  const currentSoundRef = useRef<{ ayaId: number; wordId: string } | null>(
    null,
  );

  /** Highlight multiple words (ayah) */
  const toggleHighlightAyaHandler = useCallback(
    (words: { word_id: number }[], highlight = true) => {
      const jsCode = words
        .map(
          w =>
            `document.getElementById('${w.word_id}').style.backgroundColor = '${
              highlight ? 'rgba(255, 255, 0, 0.3)' : ''
            }';`,
        )
        .join('');
      webViewRef.current?.injectJavaScript(jsCode);
    },
    [],
  );

  /** Highlight single word */
  const toggleHighlightWordHandler = useCallback(
    (wordId: string, highlight = true) => {
      const jsCode = `document.getElementById('${wordId}').style.backgroundColor = '${
        highlight ? 'rgba(255, 255, 0, 0.3)' : ''
      }';`;
      webViewRef.current?.injectJavaScript(jsCode);
    },
    [],
  );

  /** Play audio when a word is clicked */
  const handleWordClick = useCallback(
    async (audioUrl: string, wordId: string, ayaId: number) => {
      if (!audioUrl) return;
      if (isDownloadingRef.current) {
        Toast.show({ text1: 'جاري تحميل الصوتيات', type: 'info' });
        return;
      }

      const isAyahType = soundType === 'ayah';

      // Remove previous highlights
      if (currentSoundRef.current) {
        if (isAyahType) {
          const prevWords = await getWordsByAyaID(
            currentSoundRef.current.ayaId,
          );
          toggleHighlightAyaHandler(prevWords, false);
        } else {
          toggleHighlightWordHandler(currentSoundRef.current.wordId, false);
        }
      }

      currentSoundRef.current = { ayaId, wordId };

      // Highlight current selection
      let words: { word_id: number }[] = [];
      if (isAyahType) {
        words = await getWordsByAyaID(ayaId);
        toggleHighlightAyaHandler(words, true);
      } else {
        toggleHighlightWordHandler(wordId, true);
      }

      // Determine local file path
      const fileName = audioUrl.split('/').pop();
      const fileAyaName = fileName?.split('_').slice(0, 2).join('') + '.mp3';
      const filePath = isAyahType ? fileAyaName : fileName;
      const localPath = `${RNFS.DocumentDirectoryPath}/${filePath}`;

      // Check if file exists, otherwise download all audios for this page
      const exists = await RNFS.exists(localPath);
      if (!exists && !isDownloadingRef.current) {
        isDownloadingRef.current = true;
        try {
          await downloadPageAudios(pageId, p => setDownloadProgress(p));
        } catch (error) {
          console.log('🚀 ~ handleWordClick ~ error:', error);
          const errorMessage =
            (error instanceof Error && error.message) ||
            'Something went wrong while downloading this page audio.';
          Toast.show({
            type: 'error',
            text1: 'Download failed',
            text2: errorMessage,
          });
        }
        isDownloadingRef.current = false;
      }

      // Play sound and clear highlight after playback
      playSound(
        localPath,
        () => {
          // finished playing -> remove highlight
          if (isAyahType) toggleHighlightAyaHandler(words, false);
          else toggleHighlightWordHandler(wordId, false);
          currentSoundRef.current = null;
        },
        () => {
          // stopped early -> remove highlight
          if (isAyahType) toggleHighlightAyaHandler(words, false);
          else toggleHighlightWordHandler(wordId, false);
          currentSoundRef.current = null;
        },
      );
    },
    [
      pageId,
      playSound,
      soundType,
      toggleHighlightAyaHandler,
      toggleHighlightWordHandler,
    ],
  );
  return {
    webViewRef,
    handleWordClick,
    toggleHighlightAyaHandler,
    toggleHighlightWordHandler,
    downloadProgress,
  };
};

export default useQuranPageActions;
