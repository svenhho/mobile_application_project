import React from 'react';
import AppNavigator from './components/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export default function App() {

  console.disableYellowBox = true;

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
