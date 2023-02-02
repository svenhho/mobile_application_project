import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { setDoc, collection, getDocs, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase-config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';


import FetchUserData from '../../components/FetchUserData';
import MapComponent from '../../components/MapComponent';
export default function CreateNewGroup() {

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
        <View style={styles.modalContainer}>
            <Text style={styles.title}>Create a new group</Text>

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
                maxLength={7} />
            
            
            <View style={{height: 250}}>
            <MapComponent
                latitude={latitude}
                longitude={longitude}
                radius={radius}
                onUpdateLatitude={setLatitude}
                onUpdateLongitude={setLongitude}
            ></MapComponent></View>
            <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <TouchableOpacity onPress={pickImage}>
                    <Text style={{ color: '#ff5b5b' }}>Pick an image from camera roll</Text>
                </TouchableOpacity>
                {image && <Image
                    source={image ? { uri: image } : require('./DefaultProfileImage.jpg')}
                    style={styles.groupImage} />}
            </View>
            
            <TouchableOpacity
                style={styles.button1}
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
                <Text style={styles.buttonText1}>Create group</Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    button1: {
        backgroundColor: '#ff5a5f',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    buttonText1: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    groupImage: {
        width: 100,
        height: 100,
        borderRadius: 75,
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },

    createGroupButton: {
        backgroundColor: '#ff5a5f',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    modalContainer: {
        backgroundColor: '#fff',
        flex: 1,
        marginTop: 20,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'column',

    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
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

});



