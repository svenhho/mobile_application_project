import React, { useState } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { addDoc, collection } from '@firebase/firestore';
import { auth, db } from '../../firebase-config';

export default function GroupPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');


    const handleCreateGroup = async () => {
        try {
            // Create the group in the "groups" collection
            await addDoc(collection(db, 'groups'), {
                name: groupName,
                description: groupDescription
            });
            setIsModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    };
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
        backgroundColor: '#FF5B5B',
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
        borderRadius: 24,
        paddingLeft: 16,
        marginVertical: 8,
        color: '#ff5b5b',
    },
    registerButton: {
        width: '80%',
        height: 48,
        backgroundColor: '#ff5b5b',
        borderRadius: 24,
        marginVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
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
