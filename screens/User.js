import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { auth, db } from '../firebase-config';
import { setDoc, collection, getDocs, doc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FetchUserData from '../components/FetchUserData';
// import FetchGroupData from '../components/FetchGroupData';

const User = ({ navigation }) => {
    const [userData] = FetchUserData();
    // const [groupData] = FetchGroupData();


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
                    source={require('./user.jpg')}
                />
                <Text style={styles.userName}>{userData.firstname} {userData.lastname}</Text>
                <Text style={styles.userBio}>I'm a software developer and love to travel. Swipe right if you're up for an adventure!</Text>
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
