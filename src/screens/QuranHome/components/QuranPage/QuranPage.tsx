import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getPageData } from '../../../../utils/getPageData';
import QuranLine from '../QuranLine/QuranLine';
import { QuranPageData } from '../../../../types/quranPageData';
import { styles } from './styles';

type QuranPageTypes = {
  pageId: number;
};

const QuranPage = ({ pageId }: QuranPageTypes) => {
  const [data, setData] = useState<QuranPageData | null>(null);

  useEffect(() => {
    getPageData(pageId).then(setData);
  }, [pageId]);

  const centerPage = pageId < 3 ? 'center' : undefined;

  return (
    <View style={[styles.pageContainer, { justifyContent: centerPage }]}>
      {data?.lines?.map((line, index) => (
        <QuranLine key={index} line={line} />
      ))}
    </View>
  );
};

export default QuranPage;
