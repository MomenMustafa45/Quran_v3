import { StyleSheet } from 'react-native';
import { margins, paddings } from '../../../constants/desingSystem';

export const styles = StyleSheet.create({
  modalAppParent: { flex: undefined },
  modalAppContainer: { height: 'auto', paddingBottom: paddings.xl },
  modalContentParent: {
    padding: paddings.lg,
    rowGap: margins.xl,
  },
});
