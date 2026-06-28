import { View, FlatList, I18nManager } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { styles } from './styles';
import QuranPage from './components/QuranPage/QuranPage';
import useQuranHomeActions from './hooks/useQuranHomeActions';
import Header from './components/Header/Header';
import PageModal from '../../components/modals/PageModal/PageModal';
import useQuranModals, { QuranModalTypes } from './hooks/useQuranModals';
import SurasModal from '../../components/modals/SurasModal/SurasModal';
import JuzModal from '../../components/modals/JuzModal/JuzModal';
import SearchModal from '../../components/modals/SearchModal/SearchModal';
import SettingsModal from '../../components/modals/SettingsModal/SettingsModal';
import useHomeInitialActions from './hooks/useHomeInitialActions';
import { useAppSelector } from '../../store/hooks/storeHooks';
import { COLORS } from '../../constants/colors';
import LandScapeBtn from './components/LandScapeBtn/LandScapeBtn';
import { useNavigation } from '@react-navigation/native';
import {
  getAnalytics,
  logEvent,
  logScreenView,
} from '@react-native-firebase/analytics';
import {
  getCrashlytics,
  log,
  setAttribute,
} from '@react-native-firebase/crashlytics';

const isRtl = I18nManager.isRTL;
const analytics = getAnalytics();
const crashlytics = getCrashlytics();

const QuranHome = () => {
  const isDarkMode = useAppSelector(state => state.page.isDarkMode);
  const navigation = useNavigation();

  // Track screen view every time this screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Analytics: marks this as the active screen
      logScreenView(analytics, {
        screen_name: 'QuranHomeScreen',
        screen_class: 'QuranHome',
      });
      // Also log as an explicit event for funnel tracking
      logEvent(analytics, 'screen_view', {
        screen_name: 'QuranHomeScreen',
        screen_class: 'QuranHome',
      });
      // Crashlytics context: if a crash happens, we know the user was here
      log(crashlytics, 'QuranHome screen focused');
      setAttribute(crashlytics, 'last_screen', 'QuranHome');
    });

    return unsubscribe;
  }, [navigation]);

  const {
    flatListRef,
    playSound,
    getCurrentPageIndex,
    scrollToIndex,
    stopCurrentSound,
    contentWidth,
    isPortrait,
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

  const { juzs, suras } = useHomeInitialActions({ scrollToIndex });

  // Log which page the user navigated to
  const handlePageChange = useCallback(
    (e: any) => {
      getCurrentPageIndex(e);
      const pageIndex = Math.round(
        e.nativeEvent.contentOffset.x / contentWidth,
      );
      const pageNumber = pageIndex + 1;
      logEvent(analytics, 'quran_page_view', { page_number: pageNumber });
      setAttribute(crashlytics, 'last_page_viewed', String(pageNumber));
    },
    [getCurrentPageIndex, contentWidth],
  );

  // Log which modal was opened
  const handleShowModal = useCallback(
    (modalName: QuranModalTypes) => {
      showModal(modalName);
      logEvent(analytics, 'modal_opened', { modal_name: modalName });
    },
    [showModal],
  );

  const renderItem = useCallback(
    ({ item }: { item: number }) => (
      <QuranPage
        pageId={item}
        playSound={playSound}
        stopCurrentSound={stopCurrentSound}
        isPortrait={isPortrait}
        width={contentWidth}
      />
    ),
    [playSound, stopCurrentSound, contentWidth, isPortrait],
  );

  return (
    <View
      style={[
        styles.pageParent,
        { backgroundColor: isDarkMode ? COLORS.dark : COLORS.whiteGray },
      ]}
    >
      <Header
        juzs={juzs}
        suras={suras}
        showModal={handleShowModal}
        isLandscape={!isPortrait}
      />

      <View style={styles.screenContainer}>
        {!isPortrait && (
          <LandScapeBtn scrollToIndex={scrollToIndex} direction="prev" />
        )}

        <FlatList
          key={contentWidth}
          ref={flatListRef}
          data={Array.from({ length: 604 }, (_, i) => i + 1)}
          keyExtractor={item => `page-${item}`}
          renderItem={renderItem}
          onMomentumScrollEnd={handlePageChange}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          maxToRenderPerBatch={4}
          initialNumToRender={4}
          updateCellsBatchingPeriod={4}
          getItemLayout={(_, index) => ({
            length: contentWidth,
            offset: contentWidth * index,
            index,
          })}
          windowSize={3}
          inverted={!isRtl}
          removeClippedSubviews={true}
          scrollEnabled={isPortrait}
        />

        {!isPortrait && (
          <LandScapeBtn scrollToIndex={scrollToIndex} direction="next" />
        )}
      </View>

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
