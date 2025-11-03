import { View, FlatList, Dimensions, I18nManager } from 'react-native';
import React, { useCallback } from 'react';
import { styles } from './styles';
import QuranPage from './components/QuranPage/QuranPage';
import useQuranHomeActions from './hooks/useQuranHomeActions';
import Header from './components/Header/Header';

import PageModal from '../../components/modals/PageModal/PageModal';
import useQuranModals from './hooks/useQuranModals';
import SurasModal from '../../components/modals/SurasModal/SurasModal';
import JuzModal from '../../components/modals/JuzModal/JuzModal';
import SearchModal from '../../components/modals/SearchModal/SearchModal';
import SettingsModal from '../../components/modals/SettingsModal/SettingsModal';
import useHomeInitialActions from './hooks/useHomeInitialActions';
import { useAppSelector } from '../../store/hooks/storeHooks';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');
const isRtl = I18nManager.isRTL;

const QuranHome = () => {
  const isDarkMode = useAppSelector(state => state.page.isDarkMode);

  // sounds actions and words press functions
  const {
    flatListRef,
    playSound,
    getCurrentPageIndex,
    scrollToIndex,
    stopCurrentSound,
  } = useQuranHomeActions();

  // home modal handlers and actions
  const {
    pageModal,
    hideModal,
    juzModal,
    searchModal,
    settingsModal,
    showModal,
    surasModal,
  } = useQuranModals();

  // here actions for initail render of app
  const { initialPage, juzs, suras, loadedFontRef } = useHomeInitialActions();

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
    [loadedFontRef, playSound, stopCurrentSound],
  );

  return (
    <View
      style={[
        styles.pageParent,
        { backgroundColor: isDarkMode ? COLORS.dark : COLORS.whiteGray },
      ]}
    >
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
