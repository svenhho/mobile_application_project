import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import SwipeCards from 'react-native-swipe-cards';

const GroupUpPage = () => {
    const [groupData, setGroupData] = useState([]);
    const [currentUserGroup, setCurrentUserGroup] = useState('');


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

            console.log('currentUserGroup: ' + currentUserGroup);



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
            updateDoc(groupDocRef)
            const data = {
                likes: [...group.likes, currentUserGroup]
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
            await updateDoc(groupDocRef, { likes: newLikes });
        } catch (error) {
            console.error(error);
        }
    };

    const updateDoc = async (docRef, data) => {
        try {
            await docRef.update(data);
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
                    <Text style={styles.likeButtonText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDislike(group)} style={styles.dislikeButton}>
                    <Text style={styles.dislikeButtonText}>Dislike</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <SwipeCards
                cards={groupData}
                renderCard={(group) => <Card group={group} />}
                handleYup={(group) => handleLike(group)}
                handleNope={(group) => handleDislike(group)}
            />
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
