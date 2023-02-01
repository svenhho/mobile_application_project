import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const GroupCard = ({ groupData, navigation }) => (
    <TouchableOpacity
        onPress={() => {
            navigation.navigate('GroupPage', { groupData });
            navigation.navigate('My Group');
        }}
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
        padding: 10
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

export default GroupCard;
