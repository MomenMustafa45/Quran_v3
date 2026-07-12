import { Pressable, View } from 'react-native';
import { styles } from './styles';
import AppText from '../../../../components/AppText/AppText';
import { QuranModalTypes } from '../../hooks/useQuranModals';

type LandScapeHeaderProps = {
  sura: String;
  currentPage: number;
  currentJuz: number;
  showModal: (key: QuranModalTypes) => void;
};

const LandScapeHeader = ({
  currentJuz,
  currentPage,
  sura,
  showModal,
}: LandScapeHeaderProps) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => showModal(QuranModalTypes.Page)}>
        <AppText>صفحة {currentPage}</AppText>
      </Pressable>
      <Pressable onPress={() => showModal(QuranModalTypes.Suras)}>
        <AppText>{sura}</AppText>
      </Pressable>
      <Pressable onPress={() => showModal(QuranModalTypes.Juz)}>
        <AppText>جزء {currentJuz}</AppText>
      </Pressable>
    </View>
  );
};

export default LandScapeHeader;
