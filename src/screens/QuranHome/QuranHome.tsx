import { View, FlatList, Dimensions } from 'react-native';
import React from 'react';
import { styles } from './styles';
import QuranPage from './components/QuranPage/QuranPage';

const { width } = Dimensions.get('window');

const QuranHome = () => {
  return (
    <View style={styles.pageParent}>
      <FlatList
        data={Array.from({ length: 660 }, (_, i) => i + 1)}
        keyExtractor={item => `quran-page-${item}`}
        renderItem={({ item }) => (
          <View style={{ width, height: '100%' }}>
            <QuranPage pageId={item} />
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
