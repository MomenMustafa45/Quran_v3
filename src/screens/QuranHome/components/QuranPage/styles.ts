import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
});
