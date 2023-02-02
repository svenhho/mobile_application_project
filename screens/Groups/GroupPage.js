import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { db, auth } from '../../firebase-config';
import { useNavigation } from '@react-navigation/native';
import FetchUserData from '../../components/FetchUserData';
import CreateNewGroup from './CreateNewGroup';
import FetchGroupData from '../../components/FetchGroupData';
import MatchCard from '../../components/MatchCard';
import { ScrollView } from 'react-native-gesture-handler';


export default function GroupPage() {

    const navigation = useNavigation()

    const [userData] = FetchUserData();
    const [isPartOfGroup, setIsPartOfGroup] = useState(false)
    const [allGroupsData, setGroupData] = useState([]);

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

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getGroupData();
    }, []);


    const groupStatus = async () => {
        if (userData.groupid == '') {
            setIsPartOfGroup(false);
        }
        else {
            setIsPartOfGroup(true);
        }
        console.log(isPartOfGroup);
    }

    useEffect(() => {
        groupStatus();
    }, []);

    const [currentUserGroup, setCurrentUserGroup] = useState('');
    const [userGroupData, setUserGroupData] = useState([]);

    console.log(allGroupsData);

    const getUserGroupData = () => {
        try {
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
        getUserGroupData();
    }, []);

    useEffect(() => {
        if (currentUserGroup) {
            const groupDocRef = doc(db, 'groups', currentUserGroup);
            onSnapshot(groupDocRef, snapshot => {
                setUserGroupData(snapshot.data());
            });
        }
    }, [currentUserGroup]);


    const RenderGroupMembers = () => {
        const [userNames, setUserNames] = useState([]);

        useEffect(() => {
            if (userGroupData.members) {
                const groupMembers = userGroupData.members;
                groupMembers.forEach(member => {
                    const userDocRef = doc(db, 'users', member);
                    onSnapshot(userDocRef, snapshot => {
                        const firstname = snapshot.data().firstname;
                        const lastname = snapshot.data().lastname;
                        setUserNames(prevUserNames => [...prevUserNames, `${firstname} ${lastname}`]);
                    });
                });
            }
        }, []);


        return (
            <View>
                {userNames.map((name, index) => (
                    <Text style={styles.groupMemberstext} key={index}>
                        {name}
                    </Text>
                ))}
            </View>
        );
    };

    const [matchedGroupData, setMatchedGroupData] = useState([]);

    const getMatchedGroupData = () => {
        allGroupsData.forEach(groupData => {
            if (userGroupData.likes && userGroupData.likes.includes(groupData.groupid) && groupData.likes.includes(userGroupData.groupid)) {
                const updatedCurrentGroupData = { ...userGroupData, matches: [...userGroupData.matches, groupData.groupid] };
                const updatedGroupData = { ...groupData, matches: [...groupData.matches, userGroupData.groupid] };

                setMatchedGroupData(prevMatchedGroupData => [...prevMatchedGroupData, updatedCurrentGroupData, updatedGroupData]);
            }
        });
    };


    useEffect(() => {
        getMatchedGroupData();
    }, []);

    return (
        <View style={styles.container}>
            {userData.groupid == '' ? (<CreateNewGroup />) : (
                <View style={styles.container}>
                    <View style={styles.header}>
                        {/* <Text style={styles.headerTitle}>Group Profile</Text> */}
                    </View>
                    <View style={styles.userContainer}>
                        <Image
                            style={styles.userImage}
                            source={{ uri: userGroupData.image }}
                        />
                        <Text style={styles.userName}>{userGroupData.name}</Text>
                        <Text style={styles.userBio}>{userGroupData.description}</Text>

                    </View>
                    <View style={styles.userContainer}>
                        <Text style={styles.groupMembersTitle}>Group members</Text>
                        <RenderGroupMembers />
                    </View>
                    <View style={styles.userContainer}>
                        <Text style={styles.groupMembersTitle}>Matched groups</Text>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {allGroupsData.map((groupData, index) => (
                                <MatchCard
                                    groupData={groupData}
                                    navigation={navigation}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    groupImage: {
        width: 100,
        height: 100,
        borderRadius: 75,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,

        backgroundColor: '#fff',
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#ff5b5b',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    createGroupButton: {
        width: '80%',
        height: 48,
        backgroundColor: '#ff5b5b',
        borderRadius: 24,
        marginVertical: 16,
    },
    modalContainer: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        // padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    },
    title: {
        fontSize: 32,
        marginBottom: 48,
        color: '#ff5b5b',
        fontWeight: 'bold',
    },
    userContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    userImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 10,
    },
    userName: {
        fontSize: 25,
        color: '#ff5b5b',
        marginBottom: 10,
        fontWeight: 'bold',
    },

    userBio: {
        textAlign: 'center',
        fontSize: 15,
        color: '#ff5b5b',
        marginHorizontal: 20,
        fontStyle: 'italic'
    },
    groupMembersTitle: {
        fontSize: 15,
        color: '#ff5b5b',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    groupMemberstext: {
        textAlign: 'center',
        fontSize: 15,
        color: '#ff5b5b',
        marginHorizontal: 20,
    },
});
