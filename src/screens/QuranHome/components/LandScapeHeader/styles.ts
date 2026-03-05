import { StyleSheet } from 'react-native';
import { flexDirectionRow, paddings } from '../../../../constants/desingSystem';

export const styles = StyleSheet.create({
  container: {
    flexDirection: flexDirectionRow,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: paddings.md,
    position: 'relative',
    zIndex: 99999,
  },
});
