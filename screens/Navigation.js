import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import Homepage from './Homepage';
import Calendar from './Calendar';
import User from './User';
import Setting from './Settings'

//Screen names
const homeName = "Home";
const calendarName = "Calendar";
const userName = "User";
const settingsName = "Settings"

const Tab = createBottomTabNavigator();

const Navigation = ({ navigation }) => {
    return (
        <Tab.Navigator
            initialRouteName={homeName}
            padding={48}
            screenOptions={({ route }) => ({
                activeTintColor: '#1db954s',
                inactiveTintColor: 'grey',
                labelStyle: { paddingBottom: 10, fontSize: 10 },
                style: { padding: 10, height: 70 },

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (rn === calendarName) {
                        iconName = focused ? 'calendar' : 'calendar-outline'
                    } else if (rn === userName) {
                        iconName = focused ? 'person' : 'person-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}>

            <Tab.Screen name={homeName} component={Homepage} />
            <Tab.Screen name={calendarName} component={Calendar} />
            <Tab.Screen name={userName} component={User}
                options={{
                    margin: 200,
                    headerRight: () => (
                        <Ionicons name={'settings'} size={25} color={'grey'}
                            onPress={() =>
                                navigation.navigate('Settings')
                            } />

                    ),
                }} />

        </Tab.Navigator>
    );
};

export default Navigation;