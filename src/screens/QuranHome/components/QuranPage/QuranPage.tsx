import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { getPageData } from '../../../../utils/getPageData';
import { QuranPageData } from '../../../../types/quranPageData';
import { buildPageHTML } from '../../../../utils/buildPageHTML';

type QuranPageTypes = {
  pageId: number;
  loadedFont: string;
};

const QuranPage = ({ pageId, loadedFont }: QuranPageTypes) => {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    getPageData(pageId).then((data: QuranPageData) => {
      const pageHtml = buildPageHTML(data, pageId, loadedFont);
      setHtmlContent(pageHtml);
    });
  }, [pageId, loadedFont]);

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      style={styles.webview}
    />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});

export default QuranPage;
