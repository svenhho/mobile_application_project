import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './scenes/Login';
import Homepage from './scenes/Homepage';
import PersonalRecords from './scenes/PersonalRecords';
import PlanWorkout from './scenes/PlanWorkout';
import Settings from './scenes/Settings';
import SpinningWheel from './scenes/SpinningWheel';
import User from './scenes/User';
import Workout from './scenes/Workout';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
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
