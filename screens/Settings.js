import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth } from '../firebase-config';
import { signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';

export default function Settings() {

    const navigation = useNavigation()


    const signOutUser = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("signout")
            navigation.replace('Login')
        }).catch((error) => {
            // An error happened.
            console.log(error)
        });
    }

    return (
        <View styles={styles.container}>
            <Text> {auth.currentUser?.email}</Text>
            <TouchableOpacity
                onPress={signOutUser}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>
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
    emailText: {
        color: 'black',
        fontSize: 16,
        marginBottom: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '85%',
        marginTop: 50,
    },
    button: {
        backgroundColor: '#ff5a5f',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})
