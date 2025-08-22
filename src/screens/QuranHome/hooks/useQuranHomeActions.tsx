import { useCallback, useRef } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Sound from 'react-native-sound';
import Toast from 'react-native-toast-message';
import { useAppDispatch } from '../../../store/hooks/storeHooks';
import { setCurrentPage } from '../../../store/slices/pageSlice';
import { setItem } from '../../../../storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';

const { width } = Dimensions.get('window');

const useQuranHomeActions = () => {
  const flatListRef = useRef<FlatList<number>>(null);
  const currentSoundRef = useRef<Sound | null>(null);
  const stopCallbackRef = useRef<(() => void) | null>(null); // 🔥 track highlight cleanup
  const dispatch = useAppDispatch();

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
  const playSound = (
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
  };

  const getCurrentPageIndex = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const currentIndex = Math.round(offsetX / width);
      dispatch(setCurrentPage(currentIndex + 1));
      setItem(STORAGE_KEYS.CURRENT_PAGE, currentIndex + 1);
    },
    [dispatch],
  );

  const scrollToIndex = useCallback(
    (pageNumber: number) => {
      if (!flatListRef.current) return;
      const offset = (pageNumber - 1) * width;
      dispatch(setCurrentPage(pageNumber));
      setItem(STORAGE_KEYS.CURRENT_PAGE, pageNumber);
      flatListRef.current.scrollToOffset({ offset, animated: false });
    },
    [dispatch],
  );

  return {
    flatListRef,
    playSound,
    stopCurrentSound,
    getCurrentPageIndex,
    scrollToIndex,
  };
};

export default useQuranHomeActions;
