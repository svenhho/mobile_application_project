import React, { useEffect, useState } from 'react'
import { TextInput, View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signOut } from "firebase/auth";
import { authentication } from '../firebase';

export default function Login({ navigation }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged(user => {
            if (user) {
                navigation.replace('main')
            }
        })
        return unsubscribe
    }, [])


    // log in
    const loginUser = () => {
        signInWithEmailAndPassword(authentication, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('Logged in with: ' + user.email);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });
    }

    // sign out
    const signOutUser = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("signout")
        }).catch((error) => {
            // An error happened.
            console.log(error)
        });
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behaviour="padding"
        >
            <Text style={styles.buttonText}>Login</Text>
            <Text style={styles.buttonText}>Please sign in to continue.</Text>

            <View style={styles.inputContainer}>

                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input} />
                <TextInput
                    placeholder='Password'
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                    style={styles.input} />

            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={loginUser}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>
            </View>
            <View >
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('Register')
                    }
                >
                    <Text style={styles.signUpButtonText}>Sign up</Text>
                </TouchableOpacity>
            </View>


        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#191414',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
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
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#1db954',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#1db954',
        fontWeight: '700',
        fontSize: 16,
    },
    signUpButton: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    signUpButtonText: {
        color: 'blue',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
})