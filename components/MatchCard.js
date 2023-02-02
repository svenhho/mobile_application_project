import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const MatchCard = ({ groupData, navigation }) => (
    <TouchableOpacity
    >
        <View style={styles.groupContainer}>
            <Image
                style={styles.groupImage}
                source={{ uri: groupData.image }}
            />
            <Text style={styles.groupName}>{groupData.name}</Text>
        </View>
    </TouchableOpacity>
);

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
    }
});

export default MatchCard;
