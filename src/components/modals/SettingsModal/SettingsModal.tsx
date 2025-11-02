import { Switch, SwitchChangeEvent, View } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import AppModal from '../../AppModal/AppModal';
import { QuranModalTypes } from '../../../screens/QuranHome/hooks/useQuranModals';
import { styles } from './styles';
import { COLORS } from '../../../constants/colors';
import AppColorPick, { ColorPickMode } from '../../AppColorPick/AppColorPick';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { getItem, setItem } from '../../../../storage';
import {
  setIsDarkMode,
  setSoundColors,
  setWordFontSize,
  SoundColorsType,
} from '../../../store/slices/pageSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../store/hooks/storeHooks';
import Slider from '@react-native-community/slider';
import AppText from '../../AppText/AppText';

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

const MIN_FONT_SIZE = 4.0;
const MAX_FONT_SIZE = 6.0;

const SettingsModal = ({ visible, onClose }: SettingsModalProps) => {
  const soundColors = useAppSelector(state => state.page.soundColors);
  const wordFontSize = useAppSelector(state => state.page.wordFontSize);
  const isDarkMode = useAppSelector(state => state.page.isDarkMode);
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

  const handleFontSizeChange = (value: number) => {
    const valueFixed = value.toFixed(1);
    setItem(STORAGE_KEYS.WORD_FONT_SIZE, valueFixed.toString());
    dispatch(setWordFontSize(Number(valueFixed)));
  };

  const changeToDarkModeHandler = (event: SwitchChangeEvent) => {
    const changedValue = event.nativeEvent.value;
    setItem(STORAGE_KEYS.IS_DARK_MODE, changedValue);
    dispatch(setIsDarkMode(changedValue));
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

        {/* dark mode switcher */}
        <View style={styles.darkChangeContainer}>
          <AppText style={styles.wordFontSizeTitle}>
            الوضع {isDarkMode ? 'الليلي' : 'النهاري'}
          </AppText>
          <Switch
            thumbColor={COLORS.deepGold}
            value={isDarkMode}
            onChange={changeToDarkModeHandler}
            trackColor={{
              false: COLORS.whiteGray,
              true: COLORS.dark,
            }}
          />
        </View>

        {/* word size changer */}
        <View>
          <View style={styles.wordFontTitleContiner}>
            <AppText style={styles.wordFontSizeTitle}>{wordFontSize}</AppText>
            <AppText style={styles.wordFontSizeTitle}>حجم الكلمة</AppText>
          </View>
          <Slider
            style={styles.sliderContainer}
            minimumValue={MIN_FONT_SIZE}
            maximumValue={MAX_FONT_SIZE}
            minimumTrackTintColor={COLORS.goldAccent}
            maximumTrackTintColor={COLORS.lightCream}
            value={wordFontSize}
            onSlidingComplete={handleFontSizeChange}
          />
          <AppText style={styles.wordFontSizeTitle}>
            ملاحظة: تأكد من ضبط حجم الخط بما يتناسب مع شاشة جهازك حتى لا تظهر
            الكلمات خارج إطار الشاشة.
          </AppText>
        </View>
      </View>
    </AppModal>
  );
};

export default SettingsModal;
