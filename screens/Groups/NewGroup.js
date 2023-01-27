import React, { useState } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { setDoc, collection, getDocs, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase-config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function NewGroup() {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [groupMemberEmail, setGroupMemberEmail] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);

    const userColRef = collection(db, 'users');


    const handleCloseModal = () => {
        setIsModalVisible(false);
        setGroupName('');
        setGroupDescription('');
        setGroupMemberEmail('');
        setGroupMembers([]);
    }

    const handleCreateGroup = async () => {
        try {

            const groupDocRef = doc(db, "groups", groupName);
            // Create the group in the "groups" collection
            await setDoc(groupDocRef, {
                name: groupName,
                description: groupDescription,
                members: groupMembers
            });
            setIsModalVisible(false);
            handleCloseModal();
            console.log(groupMembers);
        } catch (error) {
            console.error(error);
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
                <Text style={styles.groupMemberText}>{member}</Text>
                <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
                    <Ionicons name="ios-close" size={24} color="black" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
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
    )
}

const styles = StyleSheet.create({
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
});