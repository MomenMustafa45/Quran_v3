import { View, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import QuranPage from './components/QuranPage/QuranPage';
import { loadFont } from '../../utils/loadFont';
import Sound from 'react-native-sound';
import { getSuras } from '../../database/getSuras';
import { QuranSuraType } from '../../database/types/quranSuras';

const { width } = Dimensions.get('window');

const QuranHome = () => {
  const [loadedFont, setLoadedFont] = useState('');
  const [suras, setSuras] = useState<QuranSuraType[]>([]);

  let currentSound: Sound | null = null;

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

  useEffect(() => {
    const loadFonts = async () => {
      console.log('🚀 ~ loadFonts ~ font:');
      const font = await loadFont();
      setLoadedFont(font);
      // Do something with the loaded font
    };
    const loadSuras = async () => {
      const surasData = await getSuras();
      setSuras(surasData);
    };
    loadSuras();
    loadFonts();
  }, []);

  return (
    <View style={styles.pageParent}>
      <FlatList
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
