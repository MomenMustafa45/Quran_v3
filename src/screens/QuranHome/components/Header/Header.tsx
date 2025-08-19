import { View, Text } from 'react-native';
import React from 'react';
import { QuranSuraType } from '../../../../database/types/quranSuras';
import {
  binarySearchSurah,
  linearSearchSurah,
} from '../../utils/getSurahByPage';
import { QuranJuzType } from '../../../../database/types/qraunJuz';
import { getJuzByPage } from '../../utils/getJuzByPage';
import { styles } from './styles';
import AppText from '../../../../components/AppText/AppText';
import AppIcon from '../../../../components/AppIcon/AppIcon';
import { useAppSelector } from '../../../../store/hooks/storeHooks';
import { useAppSelector } from '../../../../store/hooks/storeHooks';

type HeaderProps = {
  suras: QuranSuraType[];
  juzs: QuranJuzType[];
};

const Header = ({ suras, juzs }: HeaderProps) => {
  const currentPage = useAppSelector(state => state.page.currentPage);
  const sura =
    currentPage > 400
      ? binarySearchSurah(suras, currentPage)
      : linearSearchSurah(suras, currentPage);

  const juz = getJuzByPage(juzs, currentPage);

  return (
    <View style={styles.headerContainer}>
      {/* right */}
      <View style={styles.rightIconsContainer}>
        <AppIcon name="" type="MaterialCommunityIcons" />
      </View>
      <View style={styles.suraInfoContainer}>
        <View>
          <AppText>{sura.result?.name_arabic}</AppText>
        </View>
        <View></View>
      </View>

      {/* left */}
      <View style={styles.leftIconsContainer}></View>
    </View>
  );
};

export default Header;
