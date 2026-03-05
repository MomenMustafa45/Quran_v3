import { StyleSheet } from 'react-native';
import { paddings } from '../../../../constants/desingSystem';

export const styles = StyleSheet.create({
  landScapeBtn: {
    position: 'absolute',
    top: 0,
    zIndex: 50,
    opacity: 0.5,
    height: '100%',
    justifyContent: 'center',
    padding: paddings.md,
  },
  landScapeBtnNext: {
    right: 5,
  },
  landScapeBtnPrev: {
    left: 5,
  },
});
