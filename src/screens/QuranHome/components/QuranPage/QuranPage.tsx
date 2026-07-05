import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
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
  const { webViewRef, handleWordClick, downloadProgress } = useQuranPageActions(
    {
      pageId,
      playSound,
      stopCurrentSound,
    },
  );
  const wordFontSize = useAppSelector(state => state.page.wordFontSize);
  const isDarkMode = useAppSelector(state => state.page.isDarkMode);

  useEffect(() => {
    const loadPage = async () => {
      const data: QuranPageData = await getPageData(pageId);
      const loadedFont = await loadFont(pageId);

      const pageHtml = buildPageHTML({
        data,
        loadedFont: loadedFont || '',
        wordFontSize,
        isDarkMode,
        isPortrait,
      });
      setHtmlContent(pageHtml);
    };
    loadPage();
  }, [pageId, wordFontSize, isDarkMode, isPortrait]);

  const onMessageHandler = (event: { nativeEvent: { data: string } }) => {
    const { audio, word, aya } = JSON.parse(event.nativeEvent.data);
    handleWordClick(audio, word, aya);
  };

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
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={[
            styles.webview,
            { backgroundColor: isDarkMode ? COLORS.dark : COLORS.whiteGray },
          ]}
          onMessage={onMessageHandler}
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
