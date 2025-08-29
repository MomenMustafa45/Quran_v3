import { StyleSheet } from 'react-native';
import {
  circles,
  flexDirectionRow,
  margins,
  paddings,
  radius,
} from '../../constants/desingSystem';
import { COLORS } from '../../constants/colors';

export const styles = StyleSheet.create({
  chooseColorParent: {
    flexDirection: flexDirectionRow,
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: margins.lg,
  },
  choseColorBox: {
    width: circles.sp,
    height: circles.md,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xsm,
  },
  testWord: {},
  chooseColorTitle: {
    textAlign: 'right',
  },
  colorBtnsContainer: {
    flexDirection: flexDirectionRow,
    columnGap: margins.sm,
    flex: 1,
  },
  colorBtn: {
    flex: 1,
    padding: paddings.lg,
    borderColor: 'transparent',
    borderWidth: 2,
    borderRadius: 5000,
  },
});
