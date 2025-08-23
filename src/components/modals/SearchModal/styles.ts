import { StyleSheet } from 'react-native';
import { paddings } from '../../../constants/desingSystem';

export const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: paddings.sm,
    paddingHorizontal: paddings.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
