import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { auth, db } from '../firebase-config';
import { setDoc, collection, getDocs, doc, getDoc, updateDoc, query, where } from 'firebase/firestore';

import Ionicons from 'react-native-vector-icons/Ionicons';

const User = ({ navigation }) => {
    const [userData, setUserData] = useState({});
    const [groupData, setGroupData] = useState({});

    console.log(auth.currentUser?.email);

    const getUserData = async () => {
        try {
            if (auth.currentUser !== null) {
                const docRef = doc(db, "users", auth.currentUser.email);
                const docSnap = await getDoc(docRef);
                setUserData([]);
                const data = docSnap.data();
                setUserData({
                    firstname: data.firstname,
                    lastname: data.lastname,
                    image: data.image,
                    groupid: data.groupid
                });
            }
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    console.log(userData.firstname);
    console.log(userData.lastname);
    console.log(userData.image);
    console.log(userData.groupid);



    // const getGroupData = async () => {
    //     try {
    //         if (auth.currentUser !== null) {
    //             if (userData.groupid !== []) {
    //                 const docRef = doc(db, "groups", userData.groupid);
    //                 const docSnap = await getDoc(docRef);
    //                 setGroupData([]);
    //                 const data = docSnap.data();
    //                 setGroupData({
    //                     name: data.name,
    //                     image: data.image,
    //                 });
    //             } else {
    //                 setGroupData([]);
    //                 console.log('the user is not in a group');
    //             }
    //         }
    //     } catch (error) {
    //         alert(error);
    //     }
    // };

    // useEffect(() => {
    //     getGroupData();
    // }, []);

    // console.log(getGroupData());

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
                <Text style={styles.userBio}>I'm a software developer and love to travel. Swipe right if you're up for an adventure!</Text>
            </View>
            <View>
                <Text style={styles.userName}> Your group</Text>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => alert('Like')}
                >
                    <Ionicons name={'heart'} size={25} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => alert('Dislike')}
                >
                    <Ionicons name={'close'} size={25} color={'white'} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5A623',
        paddingTop: 16,
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
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    groupImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
    },
    groupName: {
        fontWeight: 'bold',
        fontSize: 16,
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
