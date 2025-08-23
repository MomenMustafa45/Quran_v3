import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import {
  borders,
  circles,
  flexDirectionRow,
  fontSizes,
  margins,
  paddings,
  radius,
  shadowStyle,
} from '../../constants/desingSystem';

export const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: paddings.lg,
    paddingHorizontal: paddings.md,
  },
  searchInput: {
    backgroundColor: COLORS.lightCream,
    paddingHorizontal: paddings.md,
    marginHorizontal: paddings.md,
    borderRadius: radius.md,
    direction: 'rtl',
    color: COLORS.calligraphyBlack,
    ...shadowStyle,
  },
  item: {
    flexDirection: flexDirectionRow,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: paddings.lg,
    borderBottomWidth: borders.xs,
    borderBottomColor: COLORS.backgroundBeige,
  },
  itemBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageTextBox: {
    backgroundColor: COLORS.deepGold,
    borderRadius: radius.sm,
    width: circles.md,
    height: circles.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle,
    shadowColor: COLORS.calligraphyBlack,
  },
  pageText: {
    textAlign: 'center',
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: COLORS.lightCream,
  },
  surahTextBox: {
    backgroundColor: COLORS.deepGold,
    padding: paddings.md,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadowStyle,
    shadowColor: COLORS.calligraphyBlack,
  },
  surahText: {
    textAlign: 'center',
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: COLORS.lightCream,
  },
  juzTextBox: {
    backgroundColor: COLORS.deepGold,
    padding: paddings.md,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadowStyle,
    shadowColor: COLORS.calligraphyBlack,
  },
  juzText: {
    textAlign: 'center',
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: COLORS.lightCream,
  },
  headerContainer: {
    flexDirection: flexDirectionRow,
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: paddings.md,
    backgroundColor: COLORS.deepGold,
    marginTop: margins.md,
  },
  headerText: {
    textAlign: 'center',
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
    color: COLORS.lightCream,
    flex: 1,
  },
});
