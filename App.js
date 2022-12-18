import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Settings from './screens/Settings'
import Navigation from './screens/Navigation'
import PlanWorkout from './screens/PlanWorkout';
import Register from './screens/Register';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="main" component={Navigation} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="PlanWorkout" component={PlanWorkout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
