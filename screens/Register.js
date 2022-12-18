import React, { useEffect, useState } from 'react'
import { Button, TextInput, View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signOut } from "firebase/auth";
import { authentication } from '../firebase';
import { Alert } from 'react-native';




export default function Register() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = React.useState('')

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  function validatePassword(password) {
    return passwordRegex.test(password);
  }
  const displayError = (errorMessage) => {
    Alert.alert(
      'Error',
      errorMessage,
      [
        { text: 'OK', onPress: () => console.log('OK pressed') },
      ],
      { cancelable: false }
    );
  }

  // create user / register (validate and verify in registration before calling this function, password>5!!)
  const handleSignUp = () => {
    setPassword(password);
    if (!validatePassword(password)) {
      displayError('Password must be at least 8 characters long and contain at least one letter, one number, and one special character');
    } else {
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
  }


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behaviour="padding"
    >
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
          onPress={handleSignUp}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Register</Text>
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