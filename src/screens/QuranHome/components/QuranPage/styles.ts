import { Dimensions, StyleSheet } from 'react-native';
import { fontSizes } from '../../../../constants/desingSystem';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
  progressBar: { position: 'absolute', zIndex: 5, width: '100%', top: 0 },
  progressText: { textAlign: 'center', fontSize: fontSizes.xs },
});
