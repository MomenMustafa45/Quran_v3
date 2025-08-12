import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import QuranHome from '../screens/QuranHome/QuranHome';

export type AppStackParamList = {
  QuranHome: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

const AppContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="QuranHome" component={QuranHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;
