import { View, FlatList } from 'react-native';
import React, { useState } from 'react';
import AppModal from '../../AppModal/AppModal';
import { QuranModalTypes } from '../../../screens/QuranHome/hooks/useQuranModals';
import AppInput from '../../AppInput/AppInput';
import { QuranSuraType } from '../../../database/types/quranSuras';
import QuranMenuItem from '../../ModalMainItem/ModalMainItem';
import { styles } from './styles';

type SurasModalProps = {
  visible: boolean;
  onClose: (key: QuranModalTypes) => void;
  onSelectPage: (page: number) => void;
  suras: QuranSuraType[];
};

const SurasModal = ({
  visible,
  onClose,
  onSelectPage,
  suras,
}: SurasModalProps) => {
  const [query, setQuery] = useState('');

  const onSuraClickHandler = ({ item }: { item: QuranSuraType }) => {
    const selectItem = item.page_number;
    onSelectPage(selectItem);
    onClose(QuranModalTypes.Suras);
    setQuery('');
  };

  const filteredData = () => {
    if (!query.trim()) return suras;
    return suras.filter(item => item.name_arabic.includes(query));
  };

  const renderItem = ({ item }: { item: QuranSuraType }) => (
    <QuranMenuItem onPress={() => onSuraClickHandler({ item })}>
      <QuranMenuItem.Surah>{item.name_arabic}</QuranMenuItem.Surah>
      <QuranMenuItem.Page>{item.page_number}</QuranMenuItem.Page>
      <QuranMenuItem.Juz>{item.revelation_order}</QuranMenuItem.Juz>
      <QuranMenuItem.Juz>{item.ayat_count}</QuranMenuItem.Juz>
    </QuranMenuItem>
  );

  const renderListHeader = () => (
    <QuranMenuItem.Header>
      <QuranMenuItem.HeaderText>اسم السورة</QuranMenuItem.HeaderText>
      <QuranMenuItem.HeaderText>رقم الصفحة</QuranMenuItem.HeaderText>
      <QuranMenuItem.HeaderText>نزول السورة</QuranMenuItem.HeaderText>
      <QuranMenuItem.HeaderText>عدد الايات</QuranMenuItem.HeaderText>
    </QuranMenuItem.Header>
  );

  return (
    <AppModal
      visible={visible}
      onClose={() => onClose(QuranModalTypes.Suras)}
      title="سور القران الكريم"
      customModalContentStyles={styles.modalParent}
    >
      {/* 🔍 Input */}
      <AppInput
        value={query}
        onChangeText={setQuery}
        placeholder="ادخل اسم السورة..."
      />
      <View>{renderListHeader()}</View>
      <FlatList
        data={filteredData()}
        keyExtractor={item => item.sura_id.toString()}
        renderItem={renderItem}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        contentContainerStyle={styles.listContainer}
      />
    </AppModal>
  );
};

export default SurasModal;
