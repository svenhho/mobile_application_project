import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { setDoc, collection, getDocs, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import FetchUserData from './FetchUserData';
import MapComponent from './MapComponent';

const CreateNewGroup = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [image, setImage] = useState('');
    const [groupMemberEmail, setGroupMemberEmail] = useState('');
    const groupLeader = auth.currentUser?.email;
    const [groupMembers, setGroupMembers] = useState([]);
    const likes = [];
    const swiped = []
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [radius, setRadius] = useState(2000);


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





    const userColRef = collection(db, 'users');

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setGroupName('');
        setGroupDescription('');
        setGroupMemberEmail('');
        setGroupMembers([]);
    }

    const handleCreateGroup = async () => {

        // add yourself to group
        groupMembers.push(auth.currentUser.email)
        setGroupMembers([...groupMembers, auth.currentUser.email]);
        console.log(groupMembers)
        try {
            const groupDocRef = doc(db, "groups", groupName);

            // Create the group in the "groups" collection
            await setDoc(groupDocRef, {
                name: groupName,
                description: groupDescription,
                image: image,
                groupleader: groupLeader,
                members: groupMembers,
                likes: likes,
                swiped: swiped,
                latitude: latitude,
                longitude: longitude,
                radius: radius,
            });
            const docSnap = await getDoc(groupDocRef);
            const data = docSnap.data();
            // console.log(data);


            // Add groupid to the user's document
            groupMembers.forEach(async (member) => {
                const userDocRef = doc(db, "users", member);
                await updateDoc(userDocRef, { groupid: groupDocRef.id });
                console.log("A New Document Field has been added to " + member);
            });


            setIsModalVisible(false);
            handleCloseModal();
            // console.log(groupMembers);
            setIsPartOfGroup(true);

        } catch (error) {
            console.error(error);
        }
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    async function userAlreadyExists(email) {
        try {
            const docsSnap = await getDocs(userColRef);
            return new Promise((resolve, reject) => {
                docsSnap.forEach(doc => {
                    if (doc.id == email) {
                        resolve(true);
                    }
                });
                resolve(false);
            });
        } catch (error) {
            console.error(error);
            return false;
        }
    }


    const handleRemove = (index) => {
        setGroupMembers((prev) => {
            prev.splice(index, 1);
            return [...prev];
        });
    };

    function GroupMember({ member, onRemove }) {
        return (
            <View style={styles.groupMemberContainer}>
                <Text>{member}</Text>
                <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
                    <Ionicons name="ios-close" size={24} color="black" />
                </TouchableOpacity>
            </View>
        );
    }



    return (
        <><Button
            buttonStyle={styles.createGroupButton}
            title="Create group"
            onPress={() => setIsModalVisible(true)} /><Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={{ textAlign: 'center', fontSize: 16 }}>Create a new group</Text>
                    <TextInput
                        style={{ marginLeft: 40 }}
                        placeholder="Group name"
                        value={groupName}
                        onChangeText={setGroupName}
                        autoCapitalize="none" />
                    <TextInput
                        style={{ marginLeft: 40, marginRight: 40 }}
                        placeholder="Group description"
                        value={groupDescription}
                        onChangeText={setGroupDescription}
                        autoCapitalize="none" />
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={pickImage}
                        >
                            <Text style={{ color: '#ff5b5b' }}>Pick an image from camera roll</Text>
                        </TouchableOpacity>
                        {image && <Image
                            source={image ? { uri: image } : require('../screens/Groups/DefaultProfileImage.jpg')}
                            style={styles.groupImage} />}
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginLeft: 40,
                        marginRight: 40,
                        alignItems: 'center',
                    }}>

                        <TouchableOpacity
                            onPress={async () => {
                                if (groupMemberEmail == '') {
                                    alert('Email field is empty');
                                    console.log('Email field is empty');
                                } else if (groupMemberEmail == auth.currentUser?.email) {
                                    alert('The email cannot be yours');
                                    console.log('The email cannot be yours');
                                } else if (groupMemberEmail.trim() !== '' && await userAlreadyExists(groupMemberEmail)) {
                                    setGroupMembers([...groupMembers, groupMemberEmail]);
                                    setGroupMemberEmail('');
                                    console.log(groupMembers);
                                } else {
                                    alert('User does not exist');
                                    console.log('User does not exist');
                                }
                            }}
                        >
                            <Text style={{ color: '#ff5b5b', marginRight: 10 }}>Add member</Text>
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Member email"
                            value={groupMemberEmail}
                            onChangeText={setGroupMemberEmail}
                            autoCapitalize="none" />
                    </View>
                    <View>
                        {groupMembers.map((member, index) => (
                            <GroupMember member={member} onRemove={() => handleRemove(index)} />
                        ))}
                    </View>

                    <TextInput
                        style={{ marginLeft: 40 }}
                        placeholder="Search radius in meters"
                        value={radius}
                        onChangeText={setRadius}
                        autoCapitalize="none"
                        keyboardType='numeric'
                        maxLength={6} />

                    <MapComponent
                        latitude={latitude}
                        longitude={longitude}
                        radius={radius}
                        onUpdateLatitude={setLatitude}
                        onUpdateLongitude={setLongitude}
                    ></MapComponent>

                    <View style={styles.modalButtonsContainer}>
                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => handleCloseModal()}
                        >
                            <Text style={styles.modalCancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalCreateButton}
                            onPress={async () => {
                                if (groupName !== ''
                                    && groupDescription !== ''
                                    && groupMembers !== []) {
                                    handleCreateGroup();
                                } else {
                                    console.log('All fields must be ...');
                                }
                            }}
                        >
                            <Text style={styles.modalCreateButtonText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal></>
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

export default CreateNewGroup;

