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
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from 'react-native-google-mobile-ads';
import { useRef } from 'react';

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-5893673534075496/5813472914';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const bannerRef = useRef<BannerAd>(null);

  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          // keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 40}
        >
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <Provider store={store}>
            <AppContainer />
          </Provider>
          <Toast />
        </KeyboardAvoidingView>
        <BannerAd
          ref={bannerRef}
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
