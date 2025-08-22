import { I18nManager, StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { margins, paddings } from '../../../../constants/desingSystem';

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    backgroundColor: COLORS.backgroundBeige,
    padding: paddings.sm,
  },
  rightIconsContainer: {
    flex: 1,
    rowGap: margins.xs,
    padding: paddings.xs,
  },
  suraInfoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pageInfoContainer: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    columnGap: 4,
  },
  btnsContainer: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    columnGap: margins.sm,
    flex: 1,
  },
});
