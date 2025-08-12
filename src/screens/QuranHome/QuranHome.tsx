import { View, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import QuranPage from './components/QuranPage/QuranPage';
import { loadFont } from '../../utils/loadFont';

const { width } = Dimensions.get('window');

const QuranHome = () => {
  const [loadedFont, setLoadedFont] = useState('');

  useEffect(() => {
    const loadFonts = async () => {
      console.log('🚀 ~ loadFonts ~ font:');
      const font = await loadFont();
      setLoadedFont(font);
      // Do something with the loaded font
    };

    loadFonts();
  }, []);

  return (
    <View style={styles.pageParent}>
      <FlatList
        data={Array.from({ length: 660 }, (_, i) => i + 1)}
        keyExtractor={item => `quran-page-${item}`}
        renderItem={({ item }) => (
          <View style={styles.pageItem}>
            <QuranPage pageId={item} loadedFont={loadedFont} />
          </View>
        )}
        removeClippedSubviews={true}
        inverted
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
