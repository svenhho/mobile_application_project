import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Popup from 'reactjs-popup';


// Screens
import Homepage from './Homepage';
import Calendar from './Calendar';
import User from './User';
import PlanWorkout from './PlanWorkout'

//Screen names
const homeName = "ExerPlan";
const calendarName = "Calendar";
const userName = "User";

const Tab = createBottomTabNavigator();

const Navigation = ({ navigation }) => {
    return (
        <Tab.Navigator
            initialRouteName={homeName}
            padding={48}
            screenOptions={({ route }) => ({
                padding: 200,
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