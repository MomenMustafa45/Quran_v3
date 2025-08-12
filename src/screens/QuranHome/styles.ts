import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  pageParent: {
    flex: 1,
    // backgroundColor: 'yellow',
  },
  pageItem: {
    width,
    flex: 1,
  },
});
