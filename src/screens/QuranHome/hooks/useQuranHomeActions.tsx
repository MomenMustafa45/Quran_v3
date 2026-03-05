import { useCallback, useMemo, useRef } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';
import Sound from 'react-native-sound';
import Toast from 'react-native-toast-message';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../store/hooks/storeHooks';
import { setCurrentPage } from '../../../store/slices/pageSlice';
import { setItem } from '../../../../storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { getRTLPageNumber } from '../../../utils/getRLTPageNumber';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { landScapeBtnWidth } from '../../../constants/desingSystem';

const useQuranHomeActions = () => {
  const flatListRef = useRef<FlatList<number>>(null);
  const currentSoundRef = useRef<Sound | null>(null);
  const stopCallbackRef = useRef<(() => void) | null>(null);
  const dispatch = useAppDispatch();

  // get screen dimensions
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const safeWidth = width - insets.left - insets.right;
  const isPortrait = useMemo(() => height >= width, [height, width]);

  const contentWidth = isPortrait
    ? safeWidth
    : safeWidth - landScapeBtnWidth * 2;
  const currentPage = useAppSelector(state => state.page.currentPage);

  /** Stop any currently playing sound + clear highlight */
  const stopCurrentSound = () => {
    if (currentSoundRef.current) {
      currentSoundRef.current.stop(() => {
        currentSoundRef.current?.release();
        currentSoundRef.current = null;

        // remove highlight from last word/ayah
        if (stopCallbackRef.current) {
          stopCallbackRef.current();
          stopCallbackRef.current = null;
        }
      });
    }
  };

  /** Play sound and attach cleanup callback */
  const playSound = useCallback(
    (
      filePath: string,
      onFinished?: () => void,
      onStop?: () => void, // 🔥 pass from QuranPage to remove highlights early
    ) => {
      stopCurrentSound();

      const sound = new Sound(filePath, '', error => {
        if (error) {
          Toast.show({
            type: 'error',
            text1: 'Failed to load sound',
            text2:
              error.message || 'Something went wrong while loading the sound.',
            position: 'bottom',
          });
          console.error('Failed to load sound', error);
          return;
        }

        currentSoundRef.current = sound;
        stopCallbackRef.current = onStop || null;

        sound.play(success => {
          if (onFinished) onFinished();
          if (!success) console.error('Playback failed');
          sound.release();
          currentSoundRef.current = null;
          stopCallbackRef.current = null;
        });
      });
    },
    [],
  );

  const getCurrentPageIndex = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const currentIndex = Math.round(offsetX / contentWidth);
      const currentPageNumber = getRTLPageNumber(currentIndex);

      dispatch(setCurrentPage(currentPageNumber));
      setItem(STORAGE_KEYS.CURRENT_PAGE, currentPageNumber);
    },
    [dispatch, contentWidth],
  );

  const scrollToIndex = useCallback(
    (pageNumber: number) => {
      if (!flatListRef.current) return;

      const offset = (pageNumber - 1) * contentWidth;
      dispatch(setCurrentPage(pageNumber));
      setItem(STORAGE_KEYS.CURRENT_PAGE, pageNumber);

      flatListRef.current?.scrollToOffset({ offset, animated: false });
    },
    [dispatch, contentWidth],
  );

  const scrollToNextPage = useCallback(() => {
    if (!flatListRef.current) return;

    scrollToIndex(currentPage + 1);
  }, [currentPage, scrollToIndex]);

  const scrollToPrevPage = useCallback(() => {
    if (!flatListRef.current) return;

    if (currentPage > 1) {
      scrollToIndex(currentPage - 1);
    }
  }, [currentPage, scrollToIndex]);

  return {
    flatListRef,
    playSound,
    stopCurrentSound,
    getCurrentPageIndex,
    scrollToIndex,

    scrollToNextPage,
    scrollToPrevPage,

    isPortrait,
    contentWidth,
  };
};

export default useQuranHomeActions;
