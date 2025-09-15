import { View, FlatList, Dimensions, I18nManager } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import SurasModal from '../../components/modals/SurasModal/SurasModal';
import JuzModal from '../../components/modals/JuzModal/JuzModal';
import SearchModal from '../../components/modals/SearchModal/SearchModal';
import SettingsModal from '../../components/modals/SettingsModal/SettingsModal';

const { width } = Dimensions.get('window');
const isRtl = I18nManager.isRTL;

const QuranHome = () => {
  const loadedFontRef = useRef<string>('');
  const [suras, setSuras] = useState<QuranSuraType[]>([]);
  const [juzs, setJuzs] = useState<QuranJuzType[]>([]);
  const [initialPage, setInitialPage] = useState<number | null>(null);
  const dispatch = useAppDispatch();

  const {
    flatListRef,
    playSound,
    getCurrentPageIndex,
    scrollToIndex,
    stopCurrentSound,
  } = useQuranHomeActions();

  const {
    pageModal,
    hideModal,
    juzModal,
    searchModal,
    settingsModal,
    showModal,
    surasModal,
  } = useQuranModals();

  const getSavedPaged = useCallback(() => {
    const savedPage = getItem(STORAGE_KEYS.CURRENT_PAGE);
    if (savedPage) {
      dispatch(setCurrentPage(Number(savedPage)));
      setInitialPage(Number(savedPage) - 1);
    } else {
      setInitialPage(0);
    }
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      const font = await loadFont();
      loadedFontRef.current = font;

      const [surasData, juzsData] = await Promise.all([getSuras(), getJuzs()]);
      setSuras(surasData);
      setJuzs(juzsData);

      await BootSplash.hide({ fade: true });
    };
    init();
    getSavedPaged();
  }, [getSavedPaged]);

  const renderItem = useCallback(
    ({ item }: { item: number }) => (
      <View style={styles.pageItem}>
        <QuranPage
          pageId={item}
          loadedFont={loadedFontRef.current}
          playSound={playSound}
          stopCurrentSound={stopCurrentSound}
        />
      </View>
    ),
    [playSound, stopCurrentSound],
  );

  return (
    <View style={styles.pageParent}>
      <Header juzs={juzs} suras={suras} showModal={showModal} />

      <FlatList
        ref={flatListRef}
        data={Array.from({ length: 604 }, (_, i) => i + 1)}
        initialScrollIndex={initialPage}
        keyExtractor={item => `page-${item}`}
        renderItem={renderItem}
        onMomentumScrollEnd={getCurrentPageIndex}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        maxToRenderPerBatch={4}
        initialNumToRender={4}
        updateCellsBatchingPeriod={4}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        windowSize={3}
        inverted={!isRtl}
        removeClippedSubviews={true}
      />

      <PageModal
        visible={pageModal}
        onClose={hideModal}
        onSelectPage={scrollToIndex}
      />

      <SurasModal
        onClose={hideModal}
        onSelectPage={scrollToIndex}
        suras={suras}
        visible={surasModal}
      />
      <JuzModal
        onClose={hideModal}
        onSelectPage={scrollToIndex}
        juzs={juzs}
        visible={juzModal}
      />

      <SearchModal
        onClose={hideModal}
        onSelectPage={scrollToIndex}
        visible={searchModal}
      />

      <SettingsModal visible={settingsModal} onClose={hideModal} />
    </View>
  );
};

export default QuranHome;
