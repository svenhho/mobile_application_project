import 'react-native-gesture-handler';
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Login from '../screens/Login';
import Settings from '../screens/Settings'
import Navigation from './Navigation';
import Register from '../screens/SignUp/Register';
import GroupPage from '../screens/Groups/GroupPage';
import GroupUp from '../screens/Matches/GroupUp';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="main" component={Navigation} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="GroupPage" component={GroupPage} />
      <Stack.Screen name="GroupUp" component={GroupUp} />
    </Stack.Navigator>
  );
}