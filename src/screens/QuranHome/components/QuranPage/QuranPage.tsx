import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { getPageData } from '../../../../database/getPageData';
import { QuranPageData } from '../../../../database/types/quranPageData';
import { buildPageHTML } from '../../../../utils/buildPageHTML';
import RNFS from 'react-native-fs';
import { downloadPageAudios } from '../../../../database/downloadPageAudios';
import { COLORS } from '../../../../constants/colors';

type QuranPageTypes = {
  pageId: number;
  loadedFont: string;
  playSound: (filePath: string) => void;
};

const QuranPage = ({ pageId, loadedFont, playSound }: QuranPageTypes) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const isDownloadingRef = useRef(false);

  useEffect(() => {
    getPageData(pageId).then((data: QuranPageData) => {
      const pageHtml = buildPageHTML(data, pageId, loadedFont);
      setHtmlContent(pageHtml);
    });
  }, [pageId, loadedFont]);

  const handleWordClick = async (audioUrl: string) => {
    if (!audioUrl) return;

    const fileName = audioUrl.split('/').pop(); // e.g., "003_078_002.mp3"
    const fileAyaName = fileName?.split('_').slice(0, 2).join('_'); // e.g., "003_078_002"
    console.log('🚀 ~ handleWordClick ~ fileAyaName:', fileAyaName);
    const localPath = RNFS.DocumentDirectoryPath + '/' + fileName;

    const exists = await RNFS.exists(localPath);

    if (exists) {
      playSound(localPath);
    } else {
      console.log('File not found, downloading all audios for page...');
      if (!isDownloadingRef.current) {
        isDownloadingRef.current = true;
        await downloadPageAudios(pageId);
        isDownloadingRef.current = false;
      }
      playSound(localPath);
    }
  };

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      style={styles.webview}
      onMessage={event => {
        const { audio, word, line } = JSON.parse(event.nativeEvent.data);
        console.log('🚀 ~ line:', line);
        console.log('🚀 ~ word:', word);
        handleWordClick(audio);
        console.log('Word clicked:', event.nativeEvent.data);
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
