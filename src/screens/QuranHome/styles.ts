import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  pageParent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pageItem: {
    width,
    flex: 1,
  },
});
