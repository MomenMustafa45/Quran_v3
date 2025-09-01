import { StyleSheet } from 'react-native';
import {
  flexDirectionRow,
  fontSizes,
  margins,
} from '../../../../../constants/desingSystem';
import { COLORS } from '../../../../../constants/colors';

export const styles = StyleSheet.create({
  downloadBtn: {
    flexDirection: flexDirectionRow,
    columnGap: margins.xs,
    backgroundColor: COLORS.deepGold,
    flex: 1,
  },
  prgoressContainer: {
    flex: 1,
  },
  progressText: {
    fontSize: fontSizes.xs,
    color: COLORS.lightCream,
    textAlign: 'center',
  },
});
