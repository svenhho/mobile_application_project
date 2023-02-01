import React, { useEffect, useState } from 'react'
import { TextInput, View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Button } from 'react-native'
import { auth } from '../firebase-config';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";


export default function Login({ navigation }) {


    if (auth.currentUser) {
        navigation.navigate("main");
    } else {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.navigate("main");
            }
        });
    }

    const [errorMessage, setErrorMessage] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    // log in
    const loginUser = () => {
        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    navigation.navigate("main", { user: userCredential.user });
                    setErrorMessage("");
                    setEmail("");
                    setPassword("");
                })
                .catch((error) => {
                    setErrorMessage(error.message)
                });
        } else {
            setErrorMessage("Please enter an email and password");
            console.log('Please enter an email and password');

        }
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
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.buttonText}>Please sign in to continue.</Text>
            <Text style={styles.buttonText}>{errorMessage}</Text>

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

            <TouchableOpacity
                onPress={loginUser}
                style={styles.button1}
            >
                <Text style={styles.buttonText1}>Log in</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUp}
                onPress={() =>
                    navigation.replace('Register')
                }
            >
                <Text style={styles.signUpText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>


        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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

    loginButton: {
        width: '80%',
        height: 48,
        backgroundColor: '#ff5b5b',
        borderRadius: 24,
        marginVertical: 16,
    },
    signUp: {
        alignSelf: 'center',
    },
    signUpText: {
        color: '#ff5b5b',
        marginTop: 10,
    },
    button1: {
        backgroundColor: '#ff5a5f',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    buttonText1: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
});
