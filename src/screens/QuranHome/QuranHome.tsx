import { View, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import QuranPage from './components/QuranPage/QuranPage';
import { loadFont } from '../../utils/loadFont';
import { getSuras } from '../../database/getSuras';
import { QuranSuraType } from '../../database/types/quranSuras';
import useQuranHomeActions from './hooks/useQuranHomeActions';
import Header from './components/Header/Header';
import { getJuzs } from '../../database/getJuzs';
import { QuranJuzType } from '../../database/types/qraunJuz';
import BootSplash from 'react-native-bootsplash';
import { getItem } from '../../../storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { useAppDispatch } from '../../store/hooks/storeHooks';
import { setCurrentPage } from '../../store/slices/pageSlice';
import PageModal from '../../components/modals/PageModal/PageModal';
import useQuranModals from './hooks/useQuranModals';

const { width } = Dimensions.get('window');

const QuranHome = () => {
  const [loadedFont, setLoadedFont] = useState('');
  const [suras, setSuras] = useState<QuranSuraType[]>([]);
  const [juzs, setJuzs] = useState<QuranJuzType[]>([]);
  const [initialPage, setInitialPage] = useState<number | null>(null);
  const dispatch = useAppDispatch();

  const { flatListRef, playSound, getCurrentPageIndex, scrollToIndex } =
    useQuranHomeActions();

  const {
    pageModal,
    hideModal,
    hideAllModals,
    juzModal,
    searchModal,
    settingsModal,
    showModal,
    surasModal,
  } = useQuranModals();

  useEffect(() => {
    const init = async () => {
      const savedPage = getItem(STORAGE_KEYS.CURRENT_PAGE);
      if (savedPage) {
        dispatch(setCurrentPage(Number(savedPage)));
        setInitialPage(Number(savedPage));
      }

      const font = await loadFont();
      setLoadedFont(font);

      const [surasData, juzsData] = await Promise.all([getSuras(), getJuzs()]);
      setSuras(surasData);
      setJuzs(juzsData);

      await BootSplash.hide({ fade: true });
    };
    init();
  }, []);

  return (
    <View style={styles.pageParent}>
      <Header juzs={juzs} suras={suras} showModal={showModal} />
      <FlatList
        ref={flatListRef}
        data={Array.from({ length: 604 }, (_, i) => i + 1)}
        initialScrollIndex={initialPage ? initialPage - 1 : 0}
        keyExtractor={item => item.toString()}
        renderItem={({ index }) => (
          <View style={styles.pageItem}>
            <QuranPage
              pageId={index + 1}
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
        windowSize={3}
        inverted
      />

      <PageModal
        visible={pageModal}
        onClose={hideModal}
        onSelectPage={scrollToIndex}
        juzs={juzs}
        suras={suras}
      />
    </View>
  );
};

export default QuranHome;
