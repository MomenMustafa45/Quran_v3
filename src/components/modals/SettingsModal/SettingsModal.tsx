import { View } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import AppModal from '../../AppModal/AppModal';
import { QuranModalTypes } from '../../../screens/QuranHome/hooks/useQuranModals';
import { styles } from './styles';
import { COLORS } from '../../../constants/colors';
import AppColorPick, { ColorPickMode } from '../../AppColorPick/AppColorPick';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { getItem } from '../../../../storage';
import {
  setSoundColors,
  SoundColorsType,
} from '../../../store/slices/pageSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../store/hooks/storeHooks';

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
  const soundColors = useAppSelector(state => state.page.soundColors);
  const dispatch = useAppDispatch();

  const getStoredColor = useCallback(() => {
    const storedTextColor = getItem(STORAGE_KEYS.LISTEN_WORD_COLOR);
    const storedBgTextColor = getItem(STORAGE_KEYS.LISTEN_WORD_BG_COLOR);
    const soundColorsObj: SoundColorsType = {
      wordTextColor: soundColors.wordTextColor,
      wordBgColor: soundColors.wordBgColor,
    };
    if (storedTextColor)
      soundColorsObj.wordTextColor = storedTextColor.toString();
    if (storedBgTextColor)
      soundColorsObj.wordBgColor = storedBgTextColor.toString();
    dispatch(setSoundColors({ ...soundColorsObj }));
  }, [dispatch, soundColors.wordBgColor, soundColors.wordTextColor]);

  useEffect(() => {
    getStoredColor();
  }, [
    dispatch,
    getStoredColor,
    soundColors.wordBgColor,
    soundColors.wordTextColor,
  ]);

  const soundBgTxtHandler = (color: string) => {
    dispatch(setSoundColors({ ...soundColors, wordBgColor: color }));
  };

  const soundTxtHandler = (color: string) => {
    dispatch(setSoundColors({ ...soundColors, wordTextColor: color }));
  };
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
          bgTextColorPicked={soundColors.wordBgColor}
          textColorPicked={soundColors.wordTextColor}
          setTextColorPicked={soundTxtHandler}
          setBgTextColorPicked={soundBgTxtHandler}
        />
        <AppColorPick
          colorBtns={colorBtns}
          title="لون خلفية الكلمة أثناء الإستماع"
          mode={ColorPickMode.BG_TEXT}
          bgTextColorPicked={soundColors.wordBgColor}
          textColorPicked={soundColors.wordTextColor}
          setTextColorPicked={soundTxtHandler}
          setBgTextColorPicked={soundBgTxtHandler}
        />
      </View>
    </AppModal>
  );
};

export default SettingsModal;
