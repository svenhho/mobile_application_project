import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';

const MatchCard = ({ groupData, navigation }) => {
    const [modalVisible, setModalVisible] = React.useState(false);

    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View style={styles.groupContainer}>
                    <Image
                        style={styles.groupImage}
                        source={{ uri: groupData.image }}
                    />
                    <Text style={styles.groupName}>{groupData.name}</Text>
                </View>
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalInnerContainer}>
                        <Text style={styles.modalTitle}>Group Leader</Text>
                        <Text style={styles.modalContent}>{groupData.groupleader}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    groupContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d6d7da',
        alignItems: 'center',
        padding: 10,
        marginRight: 10,

    },
    groupImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10
    },
    groupName: {
        fontWeight: 'bold'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalInnerContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: 250
    },
    modalTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
        fontWeight: '700',
        fontSize: 20
    },
    modalContent: {
        textAlign: 'center',
        fontSize: 20

    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#ff5a5f',
        borderRadius: 10,

    },
    closeButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
});

export default MatchCard;
