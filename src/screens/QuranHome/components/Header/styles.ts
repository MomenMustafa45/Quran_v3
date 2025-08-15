import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { paddings } from '../../../../constants/desingSystem';

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundBeige,
    padding: paddings.lg,
  },
  rightIconsContainer: {},
  suraInfoContainer: {},
  leftIconsContainer: {},
});
