import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Sound from 'react-native-sound';

const { width } = Dimensions.get('window');

const useQuranHomeActions = () => {
  const [currentPage, setCurrentPage] = useState(1);

  let currentSound: Sound | null = null;
  const flatListRef = useRef<FlatList<number>>(null);

  const playSound = (filePath: string) => {
    if (currentSound) {
      currentSound.stop(() => {
        currentSound?.release();
        currentSound = null;
      });
    }

    const sound = new Sound(filePath, '', error => {
      if (error) {
        console.error('Failed to load sound', error);
        return;
      }

      currentSound = sound;

      sound.play(success => {
        if (!success) {
          console.error('Playback failed');
        }
        sound.release();
        currentSound = null;
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
    // Convert page number to FlatList index (reverse order)
    const index = pageNumber - 1;
    flatListRef.current.scrollToIndex({ index, animated: true });
  }, []);
  return {
    currentPage,
    flatListRef,
    playSound,
    getCurrentPageIndex,
    scrollToIndex,
  };
};

export default useQuranHomeActions;
