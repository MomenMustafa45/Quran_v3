import { View } from 'react-native';
import React, { useCallback } from 'react';
import { QuranSuraType } from '../../../../database/types/quranSuras';
import { QuranJuzType } from '../../../../database/types/qraunJuz';
import { styles } from './styles';
import { useAppSelector } from '../../../../store/hooks/storeHooks';
import AppButton from '../../../../components/AppButton/AppButton';
import { QuranModalTypes } from '../../hooks/useQuranModals';
import { COLORS } from '../../../../constants/colors';
import { BUTTON_CONFIGS } from './utils/headerBtns';
import useHeaderActions from '../../hooks/useHeaderActions';

export const soundTypeWord = {
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
  const isDarkMode = useAppSelector(state => state.page.isDarkMode);
  const { juz, sura, soundType, switchSoundTypeHandler, currentPage } =
    useHeaderActions({
      suras,
      juzs,
    });

  const onPressBtnHandler = useCallback(
    (btnType: QuranModalTypes | null) => {
      if (btnType) {
        showModal(btnType);
      } else {
        switchSoundTypeHandler();
      }
    },
    [showModal, switchSoundTypeHandler],
  );

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: isDarkMode
            ? COLORS.calligraphyBlack
            : COLORS.backgroundBeige,
        },
      ]}
    >
      {/* right */}
      <View style={styles.btnsContainer}>
        {BUTTON_CONFIGS.map(btn => (
          <AppButton
            key={btn.id}
            iconName={btn.iconName}
            iconType={btn.iconType}
            title={btn.getTitle({ currentPage, juz, soundType, sura })}
            onPress={() => onPressBtnHandler(btn.modalType)}
            style={{
              backgroundColor: isDarkMode ? COLORS.dark : COLORS.mutedOlive,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default Header;
