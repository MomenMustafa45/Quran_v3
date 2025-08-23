import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { paddings, radius, shadowStyle } from '../../constants/desingSystem';

export const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.lightCream,
    paddingHorizontal: paddings.md,
    marginHorizontal: paddings.md,
    borderRadius: radius.md,
    color: COLORS.calligraphyBlack,
    direction: 'rtl',
    ...shadowStyle,
  },
});
