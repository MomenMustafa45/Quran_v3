import { useCallback, useRef, useState } from 'react';
import { getWordsByAyaID } from '../../../database/getWordsByAyaID';
import RNFS from 'react-native-fs';
import { downloadPageAudios } from '../../../database/downloadAudios';
import WebView from 'react-native-webview';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '../../../store/hooks/storeHooks';
import { COLORS } from '../../../constants/colors';
import { getAyahsByPageId } from '../../../database/getAyahsByPageId';

type useQuranPageActionsProps = {
  pageId: number;
  playSound: (
    filePath: string,
    onFinished?: () => void,
    onStop?: () => void,
  ) => void;
  stopCurrentSound: () => void;
};

const useQuranPageActions = ({
  pageId,
  playSound,
  stopCurrentSound,
}: useQuranPageActionsProps) => {
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const soundType = useAppSelector(state => state.page.soundType);
  const soundTxtColors = useAppSelector(state => state.page.soundColors);

  const webViewRef = useRef<WebView>(null);
  const isDownloadingRef = useRef(false);
  const currentSoundRef = useRef<{ ayaId: number; wordId: string } | null>(
    null,
  );

  /** Highlight multiple words (ayah) */
  const toggleHighlightAyaHandler = useCallback(
    (words: { word_id: number }[], highlight = true) => {
      const highlightedWord = soundTxtColors.wordTextColor;
      const highlightBGWord = soundTxtColors.wordBgColor;
      const jsCode = words
        .map(
          w =>
            `document.getElementById('${w.word_id}').style.backgroundColor = '${
              highlight ? `${highlightBGWord || COLORS.deepGold}` : ''
            }';
            document.getElementById('${w.word_id}').style.color = '${
              highlight ? `${highlightedWord || ''}` : ''
            }';
            `,
        )
        .join('');
      webViewRef.current?.injectJavaScript(jsCode);
    },
    [soundTxtColors.wordBgColor, soundTxtColors.wordTextColor],
  );

  /** Highlight single word */
  const toggleHighlightWordHandler = useCallback(
    (wordId: string, highlight = true) => {
      const highlightedWord = soundTxtColors.wordTextColor;
      const highlightBGWord = soundTxtColors.wordBgColor;
      const jsCode = `document.getElementById('${wordId}').style.backgroundColor = '${
        highlight ? `${highlightBGWord || COLORS.deepGold}` : ''
      }';
      document.getElementById('${wordId}').style.color = '${
        highlight ? `${highlightedWord || ''}` : ''
      }';
      `;
      webViewRef.current?.injectJavaScript(jsCode);
    },
    [soundTxtColors.wordBgColor, soundTxtColors.wordTextColor],
  );

  // page audio
  const playPageAudio = useCallback(async () => {
    // TODO: Replace with your function to get all ayah IDs for page
    const ayahsInPage = await getAyahsByPageId(pageId);
    console.log('🚀 ~ useQuranPageActions ~ ayahsInPage:', ayahsInPage);

    const playAyaSequentially = async (index: number) => {
      if (index >= ayahsInPage.length) {
        currentSoundRef.current = null;
        return;
      }

      const aya = ayahsInPage[index];

      // Build local file path for the aya
      const fileName = aya.audio_url.split('/').pop();
      const fileAyaName = fileName?.split('_').slice(0, 2).join('');

      const localPath = `${RNFS.DocumentDirectoryPath}/${fileAyaName}`;

      const exists = await RNFS.exists(localPath);
      if (!exists && !isDownloadingRef.current) {
        isDownloadingRef.current = true;
        try {
          await downloadPageAudios(pageId, p => setDownloadProgress(p));
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Download failed',
            text2:
              error instanceof Error
                ? error.message
                : 'Error downloading page audios',
          });
        }
        isDownloadingRef.current = false;
      }

      // Play sound
      playSound(
        localPath,
        async () => {
          await playAyaSequentially(index + 1);
        },
        () => {
          currentSoundRef.current = null;
        },
      );
    };

    // start recursive play
    playAyaSequentially(0);
    return;
  }, [pageId, playSound]);

  /** Play audio when a word is clicked */
  const handleWordClick = useCallback(
    async (audioUrl: string, wordId: string, ayaId: number) => {
      if (!audioUrl || audioUrl === 'null') return;

      if (isDownloadingRef.current) {
        Toast.show({ text1: 'جاري تحميل الصوتيات', type: 'info' });
        return;
      }

      const isAyahType = soundType === 'ayah';
      const isPageType = soundType === 'page';

      // Remove previous highlights
      if (currentSoundRef.current) {
        if (isPageType) {
          currentSoundRef.current = null;
          stopCurrentSound();
          return;
        }
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

      if (isPageType) {
        await playPageAudio();
        return;
      }

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
      console.log('🚀 ~ useQuranPageActions ~ fileAyaName:', fileAyaName);
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
      playPageAudio,
      playSound,
      soundType,
      stopCurrentSound,
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
