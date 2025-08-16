import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { getPageData } from '../../../../database/getPageData';
import { QuranPageData } from '../../../../database/types/quranPageData';
import { buildPageHTML } from '../../../../utils/buildPageHTML';
import useQuranPageActions from '../../hooks/useQuranPageActions';

type QuranPageProps = {
  pageId: number;
  loadedFont: string;
  playSound: (
    filePath: string,
    onFinished?: () => void,
    onStop?: () => void,
  ) => void;
  soundType?: 'ayah' | 'word';
};

const QuranPage = ({
  pageId,
  loadedFont,
  playSound,
  soundType = 'ayah',
}: QuranPageProps) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const { webViewRef, handleWordClick } = useQuranPageActions({
    soundType,
    pageId,
    playSound,
  });

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
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      style={styles.webview}
      onMessage={event => {
        const { audio, word, aya } = JSON.parse(event.nativeEvent.data);
        handleWordClick(audio, word, aya);
      }}
    />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});

export default QuranPage;
