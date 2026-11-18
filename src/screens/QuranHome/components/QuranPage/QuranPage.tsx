import { useCallback, useEffect, useMemo, useState } from 'react';
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

type PagePayload = {
  pageId: number;
  data: QuranPageData;
  loadedFont: string;
};

const QuranPage = ({
  pageId,
  playSound,
  stopCurrentSound,
  isPortrait,
  width,
}: QuranPageProps) => {
  const [payload, setPayload] = useState<PagePayload | null>(null);

  const { webViewRef, handleWordClick, downloadProgress } = useQuranPageActions({
    pageId,
    playSound,
    stopCurrentSound,
  });
  const wordFontSize = useAppSelector(state => state.page.wordFontSize);
  const isDarkMode = useAppSelector(state => state.page.isDarkMode);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getPageData(pageId), loadFont(pageId)]).then(
      ([data, loadedFont]) => {
        if (!cancelled) {
          setPayload({ pageId, data, loadedFont: loadedFont ?? '' });
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [pageId]);

  // Derived during render: one render per load, and never a stale frame.
  const htmlContent = useMemo(() => {
    if (!payload || payload.pageId !== pageId) {
      return '';
    }
    return buildPageHTML({
      data: payload.data,
      loadedFont: payload.loadedFont,
      wordFontSize,
      isDarkMode,
      isPortrait,
    });
  }, [payload, pageId, wordFontSize, isDarkMode, isPortrait]);

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
