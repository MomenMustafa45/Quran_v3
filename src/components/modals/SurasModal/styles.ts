import { StyleSheet } from 'react-native';
import { paddings } from '../../../constants/desingSystem';

export const styles = StyleSheet.create({
  modalParent: {
    width: '90%',
    height: '70%',
  },
  listContainer: {
    paddingVertical: paddings.sm,
    paddingHorizontal: paddings.md,
  },
});
