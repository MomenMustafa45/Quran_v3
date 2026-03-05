import { StyleSheet } from 'react-native';
import { fontSizes, paddings, radius } from '../../constants/desingSystem';
import { COLORS } from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: paddings.tiny,
    borderRadius: radius.sm,
    backgroundColor: COLORS.mutedOlive,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    color: COLORS.lightCream,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  icon: {
    color: COLORS.backgroundBeige,
  },
  disabled: {
    opacity: 0.6,
  },
});
