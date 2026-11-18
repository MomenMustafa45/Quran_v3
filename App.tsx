import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import AppContainer from './src/navigation';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { initReviewPrompt } from './src/utils/reviewPrompt';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    initReviewPrompt();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <Provider store={store}>
              <AppContainer />
            </Provider>
            <Toast />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
