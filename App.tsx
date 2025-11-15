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
  MobileAds,
} from 'react-native-google-mobile-ads';
import { useEffect } from 'react';

// Use different ad unit IDs for iOS and Android
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : Platform.select({
      ios: 'ca-app-pub-5893673534075496/5813472914',
      android: 'ca-app-pub-5893673534075496/5813472914',
    }) || 'ca-app-pub-5893673534075496/5813472914';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Initialize Mobile Ads with better configuration
    MobileAds()
      .initialize()
      .then(() => {
        console.log('AdMob initialized successfully');
      })
      .catch(error => {
        console.error('AdMob initialization error:', error);
      });
  }, []);

  const handleAdLoaded = () => {
    console.log('Banner ad loaded successfully');
  };

  const handleAdFailedToLoad = (error: Error) => {
    console.error('Banner ad failed to load:', error);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <Provider store={store}>
            <AppContainer />
          </Provider>
          <Toast />
        </KeyboardAvoidingView>

        {/* Banner Ad */}
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          onAdLoaded={handleAdLoaded}
          onAdFailedToLoad={handleAdFailedToLoad}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
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
