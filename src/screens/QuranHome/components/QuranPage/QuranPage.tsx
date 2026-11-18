import { useCallback, useEffect, useRef, useState } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import * as Progress from 'react-native-progress';
import { getPageData } from '../../../../database/getPageData';
import { QuranPageData } from '../../../../database/types/quranPageData';
import { buildPageHTML } from '../../../../utils/buildPageHTML';
import useQuranPageActions from '../../hooks/useQuranPageActions';
import { COLORS } from '../../../../constants/colors';
import AppText from '../../../../components/AppText/AppText';
import { styles } from './styles';
import { View } from 'react-native';
import { useAppSelector } from '../../../../store/hooks/storeHooks';
import { loadFont } from '../../../../utils/loadFont';

type QuranPageProps = {
  pageId: number;
  playSound: (
    filePath: string,
    onFinished?: () => void,
    onStop?: () => void,
  ) => void;
  stopCurrentSound: () => void;
  isPortrait: boolean;
  width: number;
};

const QuranPage = ({
  pageId,
  playSound,
  stopCurrentSound,
  isPortrait,
  width,
}: QuranPageProps) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [payloadVersion, setPayloadVersion] = useState(0);
  const pagePayloadRef = useRef<{
    data: QuranPageData;
    loadedFont: string;
  } | null>(null);
  const loadedPageIdRef = useRef<number | null>(null);

  const { webViewRef, handleWordClick, downloadProgress } = useQuranPageActions({
    pageId,
    playSound,
    stopCurrentSound,
  });
  const wordFontSize = useAppSelector(state => state.page.wordFontSize);
  const isDarkMode = useAppSelector(state => state.page.isDarkMode);

  useEffect(() => {
    let cancelled = false;

    const loadPagePayload = async () => {
      const [data, loadedFont] = await Promise.all([
        getPageData(pageId),
        loadFont(pageId),
      ]);

      if (cancelled) {
        return;
      }

      pagePayloadRef.current = { data, loadedFont: loadedFont ?? '' };
      loadedPageIdRef.current = pageId;
      setPayloadVersion(version => version + 1);
    };

    loadPagePayload();

    return () => {
      cancelled = true;
    };
  }, [pageId]);

  useEffect(() => {
    const payload = pagePayloadRef.current;
    if (!payload || loadedPageIdRef.current !== pageId) {
      return;
    }

    setHtmlContent(
      buildPageHTML({
        data: payload.data,
        loadedFont: payload.loadedFont,
        wordFontSize,
        isDarkMode,
        isPortrait,
      }),
    );
  }, [pageId, wordFontSize, isDarkMode, isPortrait, payloadVersion]);

  const handleWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const parsed = JSON.parse(event.nativeEvent.data) as {
          audio?: string;
          word?: string;
          aya?: number | string;
        };
        if (!parsed.audio || !parsed.word || parsed.aya === undefined) {
          return;
        }
        handleWordClick(parsed.audio, parsed.word, Number(parsed.aya));
      } catch {
        return;
      }
    },
    [handleWordClick],
  );

  return (
    <View>
      {downloadProgress > 0 && downloadProgress < 100 && (
        <Progress.Bar
          progress={downloadProgress / 100}
          width={null}
          height={3}
          borderRadius={4}
          color={COLORS.mutedOlive}
          unfilledColor={COLORS.lightCream}
          borderWidth={0}
          children={
            <AppText style={styles.progressText}>
              {Math.round(downloadProgress)}%
            </AppText>
          }
          style={{ width }}
        />
      )}
      <View style={[styles.pageParent, { width, flex: 1 }]}>
        {/* @ts-expect-error WebView ref typing mismatch in current @types */}
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={[
            styles.webview,
            { backgroundColor: isDarkMode ? COLORS.dark : COLORS.whiteGray },
          ]}
          onMessage={handleWebViewMessage}
          setSupportMultipleWindows={false}
          androidLayerType="hardware"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default QuranPage;
