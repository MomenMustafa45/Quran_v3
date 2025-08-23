import React, { useEffect, useState } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import AppModal from '../../AppModal/AppModal';
import { QuranModalTypes } from '../../../screens/QuranHome/hooks/useQuranModals';
import { getPages } from '../../../database/getPages';
import { QuranMenuPageType } from '../../../database/types/quranPageData';

type PageModalProps = {
  visible: boolean;
  onClose: (key: QuranModalTypes) => void;
  onSelectPage: (page: number) => void;
};

const PageModal = ({ visible, onClose, onSelectPage }: PageModalProps) => {
  const [pagesMeta, setPagesMeta] = useState<QuranMenuPageType[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const getPagesData = await getPages();

      setPagesMeta(getPagesData);
    };

    loadData();
  }, []);

  const filteredData = () => {
    if (!query.trim()) return pagesMeta;
    const pageNum = Number(query);
    if (isNaN(pageNum)) return [];
    return pagesMeta.filter(item => item.page_number === pageNum);
  };

  const onClickPageHandler = ({ item }: { item: QuranMenuPageType }) => {
    const selectItem = item.page_number;
    onSelectPage(selectItem);
    onClose(QuranModalTypes.Page);
    setQuery('');
  };

  const renderItem = ({ item }: { item: QuranMenuPageType }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onClickPageHandler({ item })}
    >
      <Text style={styles.pageText}>صفحة {item.page_number}</Text>
      <Text style={styles.surahText}>سورة: {item.surah_name}</Text>
      <Text style={styles.juzText}>جزء {item.juz_id}</Text>
    </TouchableOpacity>
  );

  return (
    <AppModal
      visible={visible}
      onClose={() => onClose(QuranModalTypes.Page)}
      title="الصفحات"
    >
      {/* 🔍 Input */}
      <TextInput
        value={query}
        onChangeText={setQuery}
        keyboardType="numeric"
        placeholder="ادخل رقم الصفحة..."
        style={styles.searchInput}
      />

      <FlatList
        data={filteredData()}
        keyExtractor={item => item.page_id.toString()}
        renderItem={renderItem}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
      />
    </AppModal>
  );
};

export default PageModal;

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  pageText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  surahText: { fontSize: 14, color: '#444', marginTop: 2 },
  juzText: { fontSize: 13, color: '#666', marginTop: 2 },
});
