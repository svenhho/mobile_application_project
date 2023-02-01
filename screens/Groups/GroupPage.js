import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase-config';
import FetchUserData from '../../components/FetchUserData';
import CreateNewGroup from '../../components/CreateNewGroup';


export default function GroupPage() {
    const [userData] = FetchUserData();
    const [isPartOfGroup, setIsPartOfGroup] = useState(false)

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
                    <Text style={styles.underHeadline} key={index}>
                        {name}
                    </Text>
                ))}
            </View>
        );
    };



    return (
        <View style={styles.container}>
            {userData.groupid == '' ? (<CreateNewGroup />) : (
                <View style={styles.container}>
                    <View style={styles.header}>

                        <Text style={styles.headerTitle}>Group Profile</Text>
                    </View>
                    <View style={styles.userContainer}>
                        <Image
                            style={styles.userImage}
                            source={{ uri: userGroupData.image }}
                        />
                        <Text style={styles.userName}>{userGroupData.name}</Text>
                        <Text style={styles.userBio}>{userGroupData.description}</Text>
                        <Text style={styles.userBio}>Group members</Text>
                        <RenderGroupMembers />
                    </View>
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    underHeadline: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '60%',
        marginBottom: 4,
    },
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
        backgroundColor: '#F5A623',
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5A623',
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
    modalButtonsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        padding: 4,
        backgroundColor: '#ff5b5b',
    },
    modalCancelButton: {
        width: '40%',
        backgroundColor: '#ff5b5b',
        padding: 12,
        borderRadius: 24,
        alignItems: 'center',
    },
    modalCancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalCreateButton: {
        width: '40%',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ff5b5b',
    },
    modalCreateButtonText: {
        color: '#ff5b5b',
        fontWeight: 'bold',
    },
    addMemberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    addMemberInput: {
        width: '80%',
        height: 48,
        borderWidth: 1,
        borderColor: '#ff5b5b',
        backgroundColor: '#fff',
        marginVertical: 8,
        padding: 8,
        borderRadius: 24,
    },

    groupMemberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginLeft: 40,
    },

    removeButton: {
        width: '20%',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',

    },
    cancelButton: {
        width: '80%',
        height: 48,
        backgroundColor: '#aaa',
        borderRadius: 24,
        marginVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
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
});
