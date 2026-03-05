import { StyleSheet } from 'react-native';
import {
  flexDirectionRow,
  landScapeBtnWidth,
} from '../../constants/desingSystem';

export const styles = StyleSheet.create({
  pageParent: {
    flex: 1,
    position: 'relative',
  },
  pageItem: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    flexDirection: flexDirectionRow,
  },
  landScapeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: landScapeBtnWidth,
  },
});
