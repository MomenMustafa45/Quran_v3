import { View, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { styles } from './styles';
import QuranPage from './components/QuranPage/QuranPage';
import { loadFont } from '../../utils/loadFont';
import { getSuras } from '../../database/getSuras';
import { QuranSuraType } from '../../database/types/quranSuras';
import useQuranHomeActions from './hooks/useQuranHomeActions';
import Header from './components/Header/Header';
import { getJuzs } from '../../database/getJuzs';
import { QuranJuzType } from '../../database/types/qraunJuz';
import { getHezbs } from '../../database/getHezbs';
import { QuranHezbType } from '../../database/types/quranHezb';

const { width } = Dimensions.get('window');

const QuranHome = () => {
  const [loadedFont, setLoadedFont] = useState('');
  const [suras, setSuras] = useState<QuranSuraType[]>([]);
  const [juzs, setJuzs] = useState<QuranJuzType[]>([]);
  const [hezbs, setHezbs] = useState<QuranHezbType[]>([]);
  console.log('🚀 ~ QuranHome ~ suras:', suras);
  const {
    currentPage,
    flatListRef,
    playSound,
    getCurrentPageIndex,
    scrollToIndex,
  } = useQuranHomeActions();

  useEffect(() => {
    const loadFonts = async () => {
      const font = await loadFont();
      setLoadedFont(font);
    };
    const loadSurasAndJuzsAndHezbs = async () => {
      const surasData = await getSuras();
      const juzsData = await getJuzs();
      const hezbsData = await getHezbs();
      setHezbs(hezbsData);
      setJuzs(juzsData);
      setSuras(surasData);
    };

    loadSurasAndJuzsAndHezbs();
    loadFonts();
  }, []);

  return (
    <View style={styles.pageParent}>
      <Header juzs={juzs} suras={suras} currentPage={currentPage} />
      <FlatList
        ref={flatListRef}
        data={Array.from({ length: 604 }, (_, i) => i + 1)}
        keyExtractor={item => `quran-page-${item}`}
        renderItem={({ item }) => (
          <View style={styles.pageItem}>
            <QuranPage
              pageId={item}
              loadedFont={loadedFont}
              playSound={playSound}
            />
          </View>
        )}
        onMomentumScrollEnd={getCurrentPageIndex}
        removeClippedSubviews={true}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        maxToRenderPerBatch={4}
        initialNumToRender={4}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
};

export default QuranHome;
