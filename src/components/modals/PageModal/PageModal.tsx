import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import AppModal from '../../AppModal/AppModal';
import { QuranModalTypes } from '../../../screens/QuranHome/hooks/useQuranModals';
import { getPages } from '../../../database/getPages';
import { QuranMenuPageType } from '../../../database/types/quranPageData';
import { styles } from './styles';
import QuranMenuItem from '../../ModalMainItem/ModalMainItem';
import AppInput from '../../AppInput/AppInput';

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

  // ✅ Memoized filtering (only recalculates when query/pagesMeta changes)
  const filteredData = useMemo(() => {
    if (!query.trim()) return pagesMeta;
    const pageNum = Number(query);
    if (isNaN(pageNum)) return [];
    return pagesMeta.filter(item =>
      item.page_number.toString().includes(query),
    );
  }, [query, pagesMeta]);

  // ✅ Handles selecting a page
  const onClickPageHandler = useCallback(
    (item: QuranMenuPageType) => {
      onSelectPage(item.page_number);
      onClose(QuranModalTypes.Page);
      setQuery('');
    },
    [onClose, onSelectPage],
  );

  // ✅ List item renderer
  const renderItem = useCallback(
    ({ item }: { item: QuranMenuPageType }) => (
      <QuranMenuItem onPress={() => onClickPageHandler(item)}>
        <QuranMenuItem.Page>{item.page_number}</QuranMenuItem.Page>
        <QuranMenuItem.Surah>{item.surah_name}</QuranMenuItem.Surah>
        <QuranMenuItem.Juz>{item.juz_id}</QuranMenuItem.Juz>
      </QuranMenuItem>
    ),
    [onClickPageHandler],
  );

  return (
    <AppModal
      visible={visible}
      onClose={() => onClose(QuranModalTypes.Page)}
      title="صفحات القران الكريم"
    >
      {/* 🔍 Input */}
      <AppInput
        value={query}
        onChangeText={setQuery}
        keyboardType="numeric"
        placeholder="ادخل رقم الصفحة..."
        onSubmitEditing={() => {
          const pageNumber = Number(query);
          if (pageNumber >= 1 && pageNumber <= 604) {
            onSelectPage(pageNumber);
            onClose(QuranModalTypes.Page);
            setQuery('');
          }
        }}
      />

      <QuranMenuItem.Header>
        <QuranMenuItem.HeaderText>رقم الصفحة</QuranMenuItem.HeaderText>
        <QuranMenuItem.HeaderText>اسم السورة</QuranMenuItem.HeaderText>
        <QuranMenuItem.HeaderText>رقم الجزء</QuranMenuItem.HeaderText>
      </QuranMenuItem.Header>
      <FlatList
        data={filteredData}
        keyExtractor={item => item.page_id.toString()}
        renderItem={renderItem}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        contentContainerStyle={styles.listContainer}
      />
    </AppModal>
  );
};

export default PageModal;
