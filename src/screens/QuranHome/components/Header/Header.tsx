import { View } from 'react-native';
import React, { useEffect } from 'react';
import { QuranSuraType } from '../../../../database/types/quranSuras';
import { linearSearchSurah } from '../../utils/getSurahByPage';
import { QuranJuzType } from '../../../../database/types/qraunJuz';
import { getJuzByPage } from '../../utils/getJuzByPage';
import { styles } from './styles';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../store/hooks/storeHooks';
import AppButton from '../../../../components/AppButton/AppButton';
import { getItem, setItem } from '../../../../../storage';
import { STORAGE_KEYS } from '../../../../constants/storageKeys';
import { setSoundType, SoundType } from '../../../../store/slices/pageSlice';
import { QuranModalTypes } from '../../hooks/useQuranModals';

const soundTypes: Array<'word' | 'ayah' | 'page'> = ['word', 'ayah', 'page'];

const soundTypeWord = {
  page: 'صفحة',
  word: 'كلمة',
  ayah: 'ايه',
};

type HeaderProps = {
  suras: QuranSuraType[];
  juzs: QuranJuzType[];
  showModal: (key: QuranModalTypes) => void;
};

const Header = ({ suras, juzs, showModal }: HeaderProps) => {
  const currentPage = useAppSelector(state => state.page.currentPage);
  const soundType = useAppSelector(state => state.page.soundType);
  const dispatch = useAppDispatch();
  const sura = linearSearchSurah(suras, currentPage);

  const juz = getJuzByPage(juzs, currentPage);

  const switchSoundTypeHandler = () => {
    const currentIndex = soundTypes.indexOf(soundType);
    const nextIndex = (currentIndex + 1) % soundTypes.length;
    const switchedSoundType = soundTypes[nextIndex];

    setItem(STORAGE_KEYS.SOUND_TYPE, switchedSoundType);
    dispatch(setSoundType(switchedSoundType));
  };

  const getInitialSoundType = () => {
    const storageSoundType = getItem(STORAGE_KEYS.SOUND_TYPE);
    if (storageSoundType) {
      dispatch(setSoundType(String(storageSoundType) as SoundType));
    }
  };

  useEffect(() => {
    getInitialSoundType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.headerContainer}>
      {/* right */}
      <View style={styles.btnsContainer}>
        <AppButton
          iconName="menu-book"
          iconType="MaterialIcons"
          title={currentPage.toString()}
          onPress={() => showModal(QuranModalTypes.Page)}
        />
        <AppButton
          iconName="note-text-outline"
          iconType="MaterialCommunityIcons"
          title={sura.result?.name_arabic}
          onPress={() => showModal(QuranModalTypes.Suras)}
        />
        <AppButton
          iconName="layers-outline"
          iconType="Ionicons"
          title={juz?.juz_number.toString()}
          onPress={() => showModal(QuranModalTypes.Juz)}
        />
        <AppButton
          iconName="sound"
          iconType="AntDesign"
          title={soundTypeWord[soundType]}
          onPress={switchSoundTypeHandler}
        />
        <AppButton
          iconName="search"
          iconType="MaterialIcons"
          title={'البحث'}
          onPress={() => showModal(QuranModalTypes.Search)}
        />
        <AppButton
          iconName="setting"
          iconType="AntDesign"
          title={'الاعدادات'}
          onPress={() => showModal(QuranModalTypes.Settings)}
        />
      </View>
    </View>
  );
};

export default Header;
