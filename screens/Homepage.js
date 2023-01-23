import React from 'react'
import { Text, StyleSheet, View } from 'react-native'

export default function Homepage({ navigation }) {
    return (
        <View style={styles.container}
        testID='homepagen'>
            <Text style={styles.text}>Main page in the application with "Hello _name_" and options</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#191414',
    },
    text: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})