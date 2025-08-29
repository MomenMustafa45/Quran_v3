import { FlatList, ActivityIndicator, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppModal from '../../AppModal/AppModal';
import { QuranModalTypes } from '../../../screens/QuranHome/hooks/useQuranModals';
import AppInput from '../../AppInput/AppInput';
import QuranMenuItem from '../../ModalMainItem/ModalMainItem';
import { styles } from './styles';
import { QuranAyahType } from '../../../database/types/quranAyah';
import { useDebounce } from './hooks/useDebounce';
import { searchAyats } from '../../../database/searchAyahs';

type SearchModalProps = {
  visible: boolean;
  onClose: (key: QuranModalTypes) => void;
  onSelectPage: (page: number) => void;
};

const SearchModal = ({ visible, onClose, onSelectPage }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QuranAyahType[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }
      setLoading(true);
      const ayats = await searchAyats(debouncedQuery);
      setResults(ayats);
      setLoading(false);
    };

    fetchResults();
  }, [debouncedQuery]);

  const onAyahClickHandler = (item: QuranAyahType) => {
    onSelectPage(item.page_id);
    onClose(QuranModalTypes.Search);
    setQuery('');
  };

  const renderItem = ({ item }: { item: QuranAyahType }) => (
    <QuranMenuItem onPress={() => onAyahClickHandler(item)}>
      <QuranMenuItem.Surah>{item.text_uthmani}</QuranMenuItem.Surah>
    </QuranMenuItem>
  );

  return (
    <AppModal
      visible={visible}
      onClose={() => onClose(QuranModalTypes.Search)}
      title="البحث"
      animationType="fade"
    >
      {/* 🔍 Input */}
      <AppInput
        value={query}
        onChangeText={setQuery}
        placeholder="ادخل الكلمة او الاية..."
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.ayat_id.toString()}
          renderItem={renderItem}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={7}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </AppModal>
  );
};

export default SearchModal;
