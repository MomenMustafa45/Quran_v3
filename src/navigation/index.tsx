import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QuranHome from '../screens/QuranHome/QuranHome';
import {
  getCrashlytics,
  log,
  recordError,
  setAttribute,
} from '@react-native-firebase/crashlytics';

export type AppStackParamList = {
  QuranHome: undefined;
};

// Native stack: uses platform navigation primitives via react-native-screens,
// and (unlike @react-navigation/stack) never touches the deprecated
// InteractionManager.
const Stack = createNativeStackNavigator<AppStackParamList>();
const crashlytics = getCrashlytics();

const AppContainer = () => {
  useEffect(() => {
    const initCrashlytics = async () => {
      try {
        log(crashlytics, 'App mounted');
        setAttribute(
          crashlytics,
          'environment',
          __DEV__ ? 'development' : 'production',
        );
        setAttribute(crashlytics, 'platform', Platform.OS);
      } catch (e: any) {
        recordError(crashlytics, e, 'AppContainer/initCrashlytics');
      }
    };

    initCrashlytics();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="QuranHome" component={QuranHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;
