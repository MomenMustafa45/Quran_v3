import { View } from 'react-native';
import React from 'react';
import AppText from '../AppText/AppText';
import AppButton from '../AppButton/AppButton'; // assuming this exists
import { styles } from './styles';
import { setItem } from '../../../storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';

export enum ColorPickMode {
  TEXT = 'text',
  BG_TEXT = 'bgText',
}

type AppColorPickProps = {
  colorBtns: { id: number; color: string }[];
  title: string;
  mode?: ColorPickMode;
  bgTextColorPicked: string;
  textColorPicked: string;
  setTextColorPicked: (color: string) => void;
  setBgTextColorPicked: (color: string) => void;
};

const AppColorPick = ({
  colorBtns,
  title,
  mode = ColorPickMode.TEXT,
  bgTextColorPicked,
  textColorPicked,
  setTextColorPicked,
  setBgTextColorPicked,
}: AppColorPickProps) => {
  const onColorPressHandler = (item: { id: number; color: string }) => {
    if (mode === ColorPickMode.TEXT) {
      setTextColorPicked(item.color);
      setItem(STORAGE_KEYS.LISTEN_WORD_COLOR, item.color);
    }
    if (mode === ColorPickMode.BG_TEXT) {
      setBgTextColorPicked(item.color);
      setItem(STORAGE_KEYS.LISTEN_WORD_BG_COLOR, item.color);
    }
  };

  const getsColorBtnPicked = (item: { id: number; color: string }) => {
    if (mode === ColorPickMode.TEXT) return item.color === textColorPicked;
    if (mode === ColorPickMode.BG_TEXT) return item.color === bgTextColorPicked;
  };
  return (
    <View>
      <AppText style={styles.chooseColorTitle}>{title}</AppText>
      <View style={styles.chooseColorParent}>
        <View style={[styles.choseColorBox]}>
          <AppText
            style={[
              styles.testWord,
              { color: textColorPicked, backgroundColor: bgTextColorPicked },
            ]}
          >
            إختبار
          </AppText>
        </View>
        <View style={styles.colorBtnsContainer}>
          {colorBtns.map(item => {
            const isColorPicked = getsColorBtnPicked(item);
            const borderColor = isColorPicked ? 'orange' : 'transparent';

            return (
              <AppButton
                key={item.id}
                style={[
                  styles.colorBtn,
                  { backgroundColor: item.color, borderColor },
                ]}
                onPress={() => onColorPressHandler(item)}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default AppColorPick;
