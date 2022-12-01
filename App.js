import React, {useState, useEffect, useCallback} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Homepage from './screens/Homepage';
import PersonalRecords from './screens/PersonalRecords';
import PlanWorkout from './screens/PlanWorkout';
import Settings from './screens/Settings';
import SpinningWheel from './screens/SpinningWheel';
import User from './screens/User';
import Workout from './screens/Workout';
import Register from './screens/Register';


const Stack = createNativeStackNavigator();

export default function App() {

  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
        <Stack.Screen name="Register" component={Register}/>
        <Stack.Screen name="Homepage" component={Homepage} options={{headerBackButtonMenuEnabled: false, headerBackVisible: false}}/>
        <Stack.Screen name="Personal Records" component={PersonalRecords}/>
        <Stack.Screen name="Plan Workout" component={PlanWorkout}/>
        <Stack.Screen name="Settings" component={Settings}/>
        <Stack.Screen name="Spinning Wheel" component={SpinningWheel}/>
        <Stack.Screen name="User" component={User}/>
        <Stack.Screen name="Workout" component={Workout}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
