import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Sound from 'react-native-sound';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const useQuranHomeActions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const flatListRef = useRef<FlatList<number>>(null);
  const currentSoundRef = useRef<Sound | null>(null);
  const stopCallbackRef = useRef<(() => void) | null>(null); // 🔥 track highlight cleanup

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
      setCurrentPage(604 - currentIndex);
    },
    [],
  );

  const scrollToIndex = useCallback((pageNumber: number) => {
    if (!flatListRef.current) return;
    const index = pageNumber - 1;
    flatListRef.current.scrollToIndex({ index, animated: true });
  }, []);

  return {
    currentPage,
    flatListRef,
    playSound,
    stopCurrentSound,
    getCurrentPageIndex,
    scrollToIndex,
  };
};

export default useQuranHomeActions;
