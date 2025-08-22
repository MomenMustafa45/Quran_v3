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

type QuranPageProps = {
  pageId: number;
  loadedFont: string;
  playSound: (
    filePath: string,
    onFinished?: () => void,
    onStop?: () => void,
  ) => void;
};

const QuranPage = ({ pageId, loadedFont, playSound }: QuranPageProps) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const { webViewRef, handleWordClick, downloadProgress } = useQuranPageActions(
    {
      pageId,
      playSound,
    },
  );

  /** Load HTML content for the page */
  useEffect(() => {
    const loadPage = async () => {
      const data: QuranPageData = await getPageData(pageId);
      const pageHtml = buildPageHTML(data, pageId, loadedFont);
      setHtmlContent(pageHtml);
    };
    loadPage();
  }, [pageId, loadedFont]);

  return (
    <>
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
          style={styles.progressBar}
        />
      )}
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={event => {
          const { audio, word, aya } = JSON.parse(event.nativeEvent.data);
          handleWordClick(audio, word, aya);
        }}
        setSupportMultipleWindows={false}
        androidLayerType="hardware"
      />
    </>
  );
};

export default QuranPage;
