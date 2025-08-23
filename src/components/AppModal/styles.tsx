import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import {
  flexDirectionRow,
  fontSizes,
  margins,
  paddings,
  radius,
} from '../../constants/desingSystem';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.mutedOlive,
    borderRadius: radius.md,
    height: '80%',
    width: '80%',
  },
  header: {
    flexDirection: flexDirectionRow,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: margins.lg,
    padding: paddings.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: COLORS.lightCream,
  },

  modalContentContainer: {
    flex: 1,
  },
});
