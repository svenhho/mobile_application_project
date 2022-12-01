import React, { useEffect, useState } from 'react'
import { TextInput, View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signOut } from "firebase/auth";
import { authentication } from '../firebase';
import { useNavigation } from '@react-navigation/native';

export default function Login(){
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged(user => {
            if (user) {
                navigation.replace('Homepage')
        }
        })
        return unsubscribe
    }, [])
    

    // create user / register (validate and verify in registration before calling this function, password>5!!)
    const createUser = () => {
        createUserWithEmailAndPassword(authentication, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('Registered with: ' + user.email);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ..
        });
    }

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
    
    /** 
    // sign in with google popup window
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });*/

    return(
        <KeyboardAvoidingView
            style={styles.container}
            behaviour="padding"
        >
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholder='Email' 
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}/>
                <TextInput 
                    placeholder='Password'
                    value={password}
                    onChangeText={text => setPassword(text)} 
                    secureTextEntry
                    style={styles.input}/>
                
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={loginUser}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={createUser}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
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
  })