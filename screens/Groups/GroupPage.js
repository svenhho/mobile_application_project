import React, { useState } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { addDoc, collection } from '@firebase/firestore';
import { auth, db } from '../../firebase-config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function GroupPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [groupMember, setGroupMember] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);


    const handleCreateGroup = async () => {
        try {
            // Create the group in the "groups" collection
            await addDoc(collection(db, 'groups'), {
                name: groupName,
                description: groupDescription,
                members: groupMembers
            });
            setIsModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    };


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
            <Button
                buttonStyle={styles.createGroupButton}
                title="Create group"
                onPress={() => setIsModalVisible(true)}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
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
                            value={groupMember}
                            onChangeText={setGroupMember}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => {
                                setGroupMembers([...groupMembers, groupMember]);
                                setGroupMember('');
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
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={styles.modalCancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalCreateButton}
                            onPress={handleCreateGroup}
                        >
                            <Text style={styles.modalCreateButtonText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
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
