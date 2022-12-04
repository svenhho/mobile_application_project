import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'

export default function Homepage({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Main page in the application with "Hello _name_" and options</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonOutline]}
                    title="Go to Settings"
                    onPress={() =>
                        navigation.navigate('Settings')
                    }
                ><Text style={styles.buttonText}>settings</Text></TouchableOpacity>
                <TouchableOpacity
                    title="Go to personal records"
                    style={[styles.button, styles.buttonOutline]}
                    onPress={() =>
                        navigation.navigate('Personal Records')
                    }
                ><Text style={styles.buttonText}>records</Text></TouchableOpacity>
                <TouchableOpacity
                    title="Go to User"
                    style={[styles.button, styles.buttonOutline]}
                    onPress={() =>
                        navigation.navigate('User')
                    }
                ><Text style={styles.buttonText}>user</Text></TouchableOpacity>
            </View>
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
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#1db954',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        marginTop: 5,
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})