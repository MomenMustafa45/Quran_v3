import { I18nManager, Platform, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { fontSizes, paddings, radius } from '../../constants/desingSystem';

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
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: paddings.lg,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
  },
  search: {
    margin: 12,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  item: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
  modalContentContainer: {
    flex: 1,
  },
});
