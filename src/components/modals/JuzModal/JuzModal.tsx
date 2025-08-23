import { View, FlatList } from 'react-native';
import React, { useState } from 'react';
import AppModal from '../../AppModal/AppModal';
import { QuranModalTypes } from '../../../screens/QuranHome/hooks/useQuranModals';
import AppInput from '../../AppInput/AppInput';
import QuranMenuItem from '../../ModalMainItem/ModalMainItem';
import { styles } from './styles';
import { QuranJuzType } from '../../../database/types/qraunJuz';

type JuzModalProps = {
  visible: boolean;
  onClose: (key: QuranModalTypes) => void;
  onSelectPage: (page: number) => void;
  juzs: QuranJuzType[];
};

const JuzModal = ({ visible, onClose, onSelectPage, juzs }: JuzModalProps) => {
  const [query, setQuery] = useState('');

  const onJuzClickHandler = ({ item }: { item: QuranJuzType }) => {
    const selectItem = item.page_number;
    onSelectPage(selectItem);
    onClose(QuranModalTypes.Juz);
    setQuery('');
  };

  const filteredData = () => {
    if (!query.trim()) return juzs;
    return juzs.filter(item => item.juz_number.toString().includes(query));
  };

  const renderItem = ({ item }: { item: QuranJuzType }) => (
    <QuranMenuItem onPress={() => onJuzClickHandler({ item })}>
      <QuranMenuItem.Surah>{item.juz_number}</QuranMenuItem.Surah>
      <QuranMenuItem.Page>{item.page_number}</QuranMenuItem.Page>
      <QuranMenuItem.Juz>{item.verses_count}</QuranMenuItem.Juz>
    </QuranMenuItem>
  );

  const renderListHeader = () => (
    <QuranMenuItem.Header>
      <QuranMenuItem.HeaderText>رقم الجزء</QuranMenuItem.HeaderText>
      <QuranMenuItem.HeaderText>رقم الصفحة</QuranMenuItem.HeaderText>
      <QuranMenuItem.HeaderText>عدد الايات</QuranMenuItem.HeaderText>
    </QuranMenuItem.Header>
  );

  return (
    <AppModal
      visible={visible}
      onClose={() => onClose(QuranModalTypes.Juz)}
      title="أجزاء القران الكريم"
    >
      {/* 🔍 Input */}
      <AppInput
        value={query}
        onChangeText={setQuery}
        keyboardType="numeric"
        placeholder="ادخل رقم الجزء..."
      />
      <View>{renderListHeader()}</View>
      <FlatList
        data={filteredData()}
        keyExtractor={item => item.juz_id.toString()}
        renderItem={renderItem}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        contentContainerStyle={styles.listContainer}
      />
    </AppModal>
  );
};

export default JuzModal;
