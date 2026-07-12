import { StyleSheet } from 'react-native';
import { fontSizes, margins, paddings } from '../../../constants/desingSystem';
import { COLORS } from '../../../constants/colors';

export const styles = StyleSheet.create({
  modalContainer: {
    maxHeight: '90%',
  },

  scrollContent: {
    padding: paddings.lg,
    rowGap: margins.xl,
    flexGrow: 1,
  },

  wordFontSizeTitle: {
    textAlign: 'right',
  },

  sliderContainer: {
    width: '100%',
    height: 40,
  },

  wordFontTitleContiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  wordFontSizeNotice: {
    fontSize: fontSizes.lg,
    textAlign: 'right',
    color: COLORS.calligraphyBlack,
  },

  darkChangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  fontSizeSection: {
    rowGap: margins.md,
  },
});
