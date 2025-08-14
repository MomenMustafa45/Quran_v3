/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  I18nManager,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import AppContainer from './src/navigation';
import BootSplash from 'react-native-bootsplash';
import { useEffect } from 'react';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log('BootSplash has been hidden successfully');
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
