import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppModal from '../../AppModal/AppModal';
import { QuranModalTypes } from '../../../screens/QuranHome/hooks/useQuranModals';
import { styles } from './styles';
import { COLORS } from '../../../constants/colors';
import AppColorPick, { ColorPickMode } from '../../AppColorPick/AppColorPick';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { getItem } from '../../../../storage';

type SettingsModalProps = {
  visible: boolean;
  onClose: (key: QuranModalTypes) => void;
};

const colorBtns = [
  { id: 1, color: COLORS.lightCream },
  { id: 2, color: COLORS.deepGold },
  { id: 3, color: COLORS.calligraphyBlack },
  { id: 4, color: COLORS.goldAccent },
];

const SettingsModal = ({ visible, onClose }: SettingsModalProps) => {
  const [bgTextColorPicked, setBgTextColorPicked] = useState<string>(
    COLORS.calligraphyBlack,
  );
  const [textColorPicked, setTextColorPicked] = useState(
    COLORS.calligraphyBlack,
  );

  useEffect(() => {
    const getStoredColor = () => {
      const storedTextColor = getItem(STORAGE_KEYS.LISTEN_WORD_COLOR);
      const storedBgTextColor = getItem(STORAGE_KEYS.LISTEN_WORD_BG_COLOR);
      if (storedTextColor) setTextColorPicked(storedTextColor.toString());
      if (storedBgTextColor) setBgTextColorPicked(storedBgTextColor.toString());
    };
    getStoredColor();
  }, []);

  return (
    <AppModal
      visible={visible}
      onClose={() => onClose(QuranModalTypes.Settings)}
      title="إعدادات الصفحة"
      animationType="fade"
      modalParentCustomStyles={styles.modalAppParent}
      customModalContentStyles={styles.modalAppContainer}
    >
      <View style={styles.modalContentParent}>
        <AppColorPick
          colorBtns={colorBtns}
          title="لون الكلمة أثناء الإستماع"
          mode={ColorPickMode.TEXT}
          bgTextColorPicked={bgTextColorPicked}
          textColorPicked={textColorPicked}
          setTextColorPicked={setTextColorPicked}
          setBgTextColorPicked={setBgTextColorPicked}
        />
        <AppColorPick
          colorBtns={colorBtns}
          title="لون خلفية الكلمة أثناء الإستماع"
          mode={ColorPickMode.BG_TEXT}
          bgTextColorPicked={bgTextColorPicked}
          textColorPicked={textColorPicked}
          setTextColorPicked={setTextColorPicked}
          setBgTextColorPicked={setBgTextColorPicked}
        />
      </View>
    </AppModal>
  );
};

export default SettingsModal;
