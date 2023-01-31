import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { setDoc, collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase-config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import FetchUserData from '../../components/FetchUserData';
import FetchGroupData from '../../components/FetchGroupData';


export default function GroupPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [image, setImage] = useState('');
    const [groupMemberEmail, setGroupMemberEmail] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const likes = [];
    const swiped = []

    const [userData] = FetchUserData();
    const [isPartOfGroup, setIsPartOfGroup] = useState(false)

    const groupStatus = async () => {
        if (userData.groupid == '') {
            setIsPartOfGroup(false);
        }
        if (userData.groupid != ''){
            setIsPartOfGroup(true);
        }
        console.log(isPartOfGroup);
    }

    useEffect(() => {
        groupStatus();
    }, []);

    const [userGroupData] = FetchGroupData();
    
    function RenderGroupMembers() {
        if (userGroupData.members) {
        userGroupData.members.forEach((element, index) => {
            const key = index;
            return (
                <Text key={key} style={styles.underHeadline}>{element}</Text>
            )
        });         
        }
    }
    

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
        //setGroupMembers([...groupMembers, auth.currentUser.email]);
        console.log(groupMembers)
        try {
            const groupDocRef = doc(db, "groups", groupName);
            
            // Create the group in the "groups" collection
            await setDoc(groupDocRef, {
                name: groupName,
                description: groupDescription,
                image: image,
                members: groupMembers,
                likes: likes,
                swiped: swiped
            });
            const docSnap = await getDoc(groupDocRef);
            const data = docSnap.data();
            console.log(data);
            
            
            // Add groupid to the user's document
            groupMembers.forEach(async (member) => {
                const userDocRef = doc(db, "users", member);
                await updateDoc(userDocRef, { groupid: groupDocRef.id });
                console.log("A New Document Field has been added to " + member);
            });


            setIsModalVisible(false);
            handleCloseModal();
            console.log(groupMembers);
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

        console.log(result);

        if (!result.canceled) {

            setImage(result.assets[0].uri);
        }
        console.log(image);
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
                <Text style={styles.groupMemberText}>{member}</Text>
                <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
                    <Ionicons name="ios-close" size={24} color="black" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isPartOfGroup == false && (
            <Button
                buttonStyle={styles.createGroupButton}
                title="Create group"
                onPress={() => setIsModalVisible(true)}
            />)}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() =>
                    setIsModalVisible(false)
                }
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Create a new group</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Group name"
                        value={groupName}
                        onChangeText={setGroupName}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Group description"
                        value={groupDescription}
                        onChangeText={setGroupDescription}
                        autoCapitalize="none"
                    />
                    <View style={styles.modalInput}>
                        <Button title="Pick an image from camera roll" onPress={pickImage} />
                        {image && <Image
                            source={image ? { uri: image } : require('./DefaultProfileImage.jpg')}
                            style={styles.groupImage}
                        />}
                    </View>
                    <View>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Add member"
                            value={groupMemberEmail}
                            onChangeText={setGroupMemberEmail}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={async () => {
                                if (groupMemberEmail == '') {
                                    console.log('Email field is empty')
                                } else if (groupMemberEmail == auth.currentUser?.email) {
                                    console.log('The email cannot be yours');
                                } else if (groupMemberEmail.trim() !== '' && await userAlreadyExists(groupMemberEmail)) {
                                    setGroupMembers([...groupMembers, groupMemberEmail]);
                                    setGroupMemberEmail('')
                                    console.log(groupMembers)
                                } else {
                                    console.log('User does not exist')
                                }
                            }}
                        >
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {groupMembers.map((member, index) => (
                            <GroupMember member={member} onRemove={() => handleRemove(index)} />
                        ))}
                    </View>
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
                                    console.log('All fields must be ...')
                                }
                            }}
                        >
                            <Text style={styles.modalCreateButtonText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {isPartOfGroup == true && (
                <View style={styles.groupViewContainer}>
                    <View style={styles.headerGroup}>
                        <Image
                            style={styles.groupImage}
                            source={{ uri: userGroupData.image }}/>
                        <Text style={styles.headerTitle}>{userGroupData.name}</Text>
                        <Text style={styles.descriptionStyle}>{userGroupData.description}</Text>
                        <Text style={styles.underHeadline}>Group members:</Text>
                        <RenderGroupMembers></RenderGroupMembers>
                    </View>
                    
                </View>
            )}

        </View>
    );
}


const styles = StyleSheet.create({
    elementStyle: {
        color: 'white',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '60%',
        fontSize: 16,
        marginBottom: 4,
    },
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
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
        marginTop: 30,
    },
    groupViewContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    headerGroup: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',
    },
    descriptionStyle: {
        fontSize: 16,
        color: 'white',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '60%',
        marginBottom: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF5B5B',
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
        alignItems: 'center',
        justifyContent: 'center',
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
    input: {
        width: '80%',
        height: 48,
        borderWidth: 1,
        borderColor: '#ff5b5b',
        backgroundColor: '#fff',
        marginVertical: 8,
        padding: 8,
        borderRadius: 24,
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
    addMemberButton: {
        width: '20%',
        height: 48,
        backgroundColor: '#ff5b5b',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addMemberButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    groupMemberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 8,
    },
    groupMemberInput: {
        width: '80%',
        height: 48,
        borderWidth: 1,
        borderColor: '#ff5b5b',
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 24,
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
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 20,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
    },
});
