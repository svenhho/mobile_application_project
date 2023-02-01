import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { db } from '../firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FetchUserData from '../components/FetchUserData';
import GroupCard from '../components/GroupCard';


const User = ({ navigation }) => {
    const [userData] = FetchUserData();
    const [userGroupData, setUserGroupData] = useState([]);

    const getUserGroupData = () => {
        try {
            if (userData.groupid) {
                const groupDocRef = doc(db, 'groups', userData.groupid);
                onSnapshot(groupDocRef, snapshot => {
                    setUserGroupData(snapshot.data());
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getUserGroupData();
    }, [userGroupData]);


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Ionicons name={'settings'} size={25} color={'white'} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Profile</Text>
            </View>
            <View style={styles.userContainer}>
                <Image
                    style={styles.userImage}
                    source={{ uri: userData.image }}
                />
                <Text style={styles.userName}>{userData.firstname} {userData.lastname}</Text>
            </View>
            <View style={styles.userContainer}>
                <Text style={styles.userName}>Your group</Text>
                {userGroupData.name !== '' ? (
                    <GroupCard groupData={userGroupData} navigation={navigation} />
                ) : (<Text style={styles.userName} onPress={() => navigation.navigate('My Group')}>Log in</Text>
                )}

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5A623',
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#F5A623',
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',
    },
    userContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    userImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
    },
    userName: {
        fontSize: 25,
        color: 'white',
        marginBottom: 10,
    },
    userBio: {
        textAlign: 'center',
        fontSize: 15,
        color: 'white',
        marginHorizontal: 20,
    },
    groupContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d6d7da',
        alignItems: 'center',
        padding: 10
    },
    groupImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10
    },
    groupName: {
        fontWeight: 'bold'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F5A623',
        padding: 10,
    },
    footerButton: {
        padding: 20,
    },
});

export default User;
