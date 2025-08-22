import React, { useEffect, useState } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import AppModal from '../../AppModal/AppModal';
import { QuranSuraType } from '../../../database/types/quranSuras';
import { QuranJuzType } from '../../../database/types/qraunJuz';
import { QuranModalTypes } from '../../../screens/QuranHome/hooks/useQuranModals';
import {
  binarySearchSurah,
  linearSearchSurah,
} from '../../../screens/QuranHome/utils/getSurahByPage';
import { getJuzByPage } from '../../../screens/QuranHome/utils/getJuzByPage';

type PageModalProps = {
  visible: boolean;
  onClose: (key: QuranModalTypes) => void;
  onSelectPage: (page: number) => void;
  suras: QuranSuraType[];
  juzs: QuranJuzType[];
};

type PageMeta = {
  page: number;
  surah: string | undefined;
  juz: number | undefined;
};

const PageModal = ({
  visible,
  onClose,
  onSelectPage,
  suras,
  juzs,
}: PageModalProps) => {
  const [pagesMeta, setPagesMeta] = useState<PageMeta[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const loadData = () => {
      const meta: PageMeta[] = Array.from({ length: 604 }, (_, i) => {
        const page = i + 1;
        const surah =
          page > 400
            ? binarySearchSurah(suras, page).result?.name_arabic
            : linearSearchSurah(suras, page).result?.name_arabic;

        const juz = getJuzByPage(juzs, page)?.juz_number;

        return { page, surah, juz };
      });

      setPagesMeta(meta);
    };

    loadData();
  }, [juzs, suras]);

  const filteredData = () => {
    if (!query.trim()) return pagesMeta;
    const pageNum = Number(query);
    if (isNaN(pageNum)) return [];
    return pagesMeta.filter(item => item.page === pageNum);
  };

  const onClickPageHandler = ({ item }: { item: PageMeta }) => {
    const selectItem = item.page;
    onSelectPage(selectItem);
    onClose(QuranModalTypes.Page);
    setQuery('');
  };

  const renderItem = ({ item }: { item: PageMeta }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onClickPageHandler({ item })}
    >
      <Text style={styles.pageText}>صفحة {item.page}</Text>
      <Text style={styles.surahText}>سورة: {item.surah}</Text>
      <Text style={styles.juzText}>جزء {item.juz}</Text>
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
        keyExtractor={item => item.page.toString()}
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
