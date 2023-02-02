import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import SwipeCards from 'react-native-swipe-cards';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CreateNewGroup from '../Groups/CreateNewGroup';


const GroupUpPage = () => {
    const [groupData, setGroupData] = useState([]);
    const [currentUserGroup, setCurrentUserGroup] = useState('');
    const filteredGroups = groupData.filter(group => !group.swiped || !group.swiped.includes(currentUserGroup));
    const currentUserData = groupData.find(group => group.name === currentUserGroup);
    console.log(currentUserGroup);

    const [filteredGroupsDistance, setFilteredGroupDistance] = useState([]);
    const addToArray = (newValue) => {
        setFilteredGroupDistance([...filteredGroupsDistance, newValue]);
    }
    console.log("group data", groupData);
    console.log("current usergroup", currentUserGroup);
    console.log("filteredgroups", filteredGroups);
    console.log("currentuserdata", currentUserData);
    console.log("DISTANSE");
    console.log(filteredGroupsDistance);



    const checkDistance = async () => {
        const latitude1 = currentUserData.latitude;
        const longitude1 = currentUserData.longitude;
        const userRadius = parseInt(currentUserData.radius);
        for (let i = 0; i < filteredGroups.length; i++) {
            let latitude2 = filteredGroups[i].latitude;
            let longitude2 = filteredGroups[i].longitude;

            const radiansLatitude1 = latitude1 * Math.PI / 180;
            const radiansLongitude1 = longitude1 * Math.PI / 180;
            const radiansLatitude2 = latitude2 * Math.PI / 180;
            const radiansLongitude2 = longitude2 * Math.PI / 180;

            const a = Math.sin(radiansLatitude1) * Math.sin(radiansLatitude2) + Math.cos(radiansLatitude1) * Math.cos(radiansLatitude2) * Math.cos(radiansLongitude2 - radiansLongitude1);
            const c = Math.acos(a);
            const distance = c * 6371 * 1000;


            console.log(distance);
            console.log(userRadius);
            if (distance < userRadius) {
                addToArray(filteredGroups[i]);
            }
        }
    }

    useLayoutEffect(() => {
        checkDistance();
    }, []);


    const getGroupData = () => {
        try {
            const groupColRef = collection(db, 'groups');
            onSnapshot(groupColRef, docsSnap => {
                let allDocs = [];
                docsSnap.forEach(doc => {
                    allDocs.push(doc.data());
                });
                setGroupData(allDocs);
            });


            // get current user's group
            const userDocRef = doc(db, 'users', auth.currentUser?.email);
            onSnapshot(userDocRef, snapshot => {
                setCurrentUserGroup(snapshot.data().groupid);
            });

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getGroupData();
    }, []);



    const handleLike = async (group) => {
        try {
            // add current user's group to the liked group's 'likes' list
            const groupDocRef = doc(db, 'groups', group.name);
            const data = {
                likes: [...group.likes, currentUserGroup],
                swiped: [...group.swiped, currentUserGroup]
            }
            await updateDoc(groupDocRef, data)
            console.log("Value of an Existing Document Field has been updated");

        } catch (error) {
            console.error(error);
        }
    };

    const handleDislike = async (group) => {
        try {
            // remove current user's group from the disliked group's 'likes' list
            const groupDocRef = doc(db, 'groups', group.name);
            const newLikes = group.likes.filter(like => like !== currentUserGroup);

            const data = {
                likes: newLikes,
                swiped: [...group.swiped, currentUserGroup]
            }
            await updateDoc(groupDocRef, data);
            console.log("Value of an Existing Document Field has been updated");

        } catch (error) {
            console.error(error);
        }
    };

    const Card = ({ group }) => {
        return (
            <View style={styles.cardContainer}>
                <Image style={styles.groupImage} source={{ uri: group.image }} />
                <View style={styles.groupInfoContainer}>
                    <Text style={styles.groupNameText}>{group.name}</Text>
                    <Text style={styles.groupDescriptionText}>{group.description}</Text>
                </View>
                <TouchableOpacity onPress={() => handleLike(group)} style={styles.likeButton}>
                    <Ionicons name={'heart'} size={25} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDislike(group)} style={styles.dislikeButton}>
                    <Ionicons name={'close'} size={25} color={'white'} />
                </TouchableOpacity>
            </View>
        );
    };



    return (
        <View style={styles.container}>
            {currentUserGroup == '' ? (<CreateNewGroup />) : (<SwipeCards
                useNativeDriver={true}
                cards={filteredGroupsDistance}
                renderCard={(group) => <Card group={group} />}
                handleYup={(group) => handleLike(group)}
                handleNope={(group) => handleDislike(group)}
            />

            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContainer: {
        width: 300,
        height: 400,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 20,
    },
    groupImage: {
        width: '100%',
        height: 200,
    },
    groupInfoContainer: {
        padding: 10,
    },
    groupNameText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    groupDescriptionText: {
        color: 'grey',
        fontSize: 14,
    },
    likeButton: {
        backgroundColor: '#3F51B5',
        padding: 10,
        borderRadius: 5,
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    likeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    dislikeButton: {
        backgroundColor: '#FF1744',
        padding: 10,
        borderRadius: 5,
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    dislikeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default GroupUpPage;
