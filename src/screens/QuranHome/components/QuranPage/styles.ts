import { Dimensions, StyleSheet } from 'react-native';
import { fontSizes } from '../../../../constants/desingSystem';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  pageParent: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  pageContainer: {
    width,
    flex: 1,
    padding: 8,
  },
  header: {
    height: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
  content: {
    padding: 8,
  },
  progressBar: { width: '100%' },
  progressText: { textAlign: 'center', fontSize: fontSizes.xs },
});
