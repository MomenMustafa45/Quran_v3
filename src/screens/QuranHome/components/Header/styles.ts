import { StyleSheet } from 'react-native';
import {
  flexDirectionRow,
  margins,
  paddings,
} from '../../../../constants/desingSystem';

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: flexDirectionRow,
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
    flexDirection: flexDirectionRow,
    columnGap: 4,
  },
  btnsContainer: {
    flexDirection: flexDirectionRow,
    columnGap: margins.sm,
    flex: 1,
  },
});
