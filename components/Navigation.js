import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


// Screens
import GroupPage from '../screens/Groups/GroupPage';
import GroupUp from '../screens/Matches/GroupUp';
import User from '../screens/User';

//Screen names
const groupPageName = "My Group";
const groupUpName = "GroupUp";
const userName = "User";

const Tab = createBottomTabNavigator();

const Navigation = ({ navigation }) => {
    return (
        <Tab.Navigator
            initialRouteName={groupUpName}
            padding={48}
            screenOptions={({ route }) => ({
                padding: 200,
                activeTintColor: '#ff5b5b',
                inactiveTintColor: 'grey',
                labelStyle: { paddingBottom: 10, fontSize: 10 },
                style: { padding: 10, height: 70 },

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === groupPageName) {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (rn === groupUpName) {
                        iconName = focused ? 'heart' : 'heart-outline'
                    } else if (rn === userName) {
                        iconName = focused ? 'person' : 'person-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;

                },
            })}>

            <Tab.Screen name={groupPageName} component={GroupPage} options={{ headerShown: false }}
            />
            <Tab.Screen name={groupUpName} component={GroupUp} options={{ headerShown: false }} />
            <Tab.Screen name={userName} component={User}
                options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default Navigation;