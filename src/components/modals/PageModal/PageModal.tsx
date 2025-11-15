import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import AppModal from '../../AppModal/AppModal';
import { QuranModalTypes } from '../../../screens/QuranHome/hooks/useQuranModals';
import { getPages } from '../../../database/getPages';
import { QuranMenuPageType } from '../../../database/types/quranPageData';
import { styles } from './styles';
import QuranMenuItem from '../../ModalMainItem/ModalMainItem';
import AppInput from '../../AppInput/AppInput';
import PageItem from './components/PageItem/PageItem';
import { convertArabicToEnglishNumbers } from '../../../utils/convertArabicToEnglishNumbers';

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

  const filteredData = useMemo(() => {
    if (!query.trim()) return pagesMeta;
    const normalized = convertArabicToEnglishNumbers(query.trim());
    const pageNum = Number(normalized);
    if (isNaN(pageNum)) return [];
    return pagesMeta.filter(item =>
      item.page_number.toString().includes(normalized),
    );
  }, [query, pagesMeta]);

  const onClickPageHandler = useCallback(
    (item: QuranMenuPageType) => {
      onSelectPage(item.page_number);
      onClose(QuranModalTypes.Page);
      setQuery('');
    },
    [onClose, onSelectPage],
  );

  const renderItem = useCallback(
    ({ item }: { item: QuranMenuPageType }) => {
      return <PageItem item={item} onClickPageHandler={onClickPageHandler} />;
    },
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
        maxLength={3}
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
