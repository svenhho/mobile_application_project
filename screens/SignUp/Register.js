import React, { useEffect, useState } from 'react'
import { TextInput, View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { auth, app } from "../../firebase-config";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';





export default function Register({ navigation }) {

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace('main')
      }
    })
    return unsubscribe
  }, [])



  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Create the user in the Firebase authentication system
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Navigate to the login screen
      navigation.replace('Login');

      const userId = `${userCredential.user.uid}`;
      console.log(userId);


      // Get a reference to the Firestore database
      const db = firebase.firestore();
      await db.collection('users').doc(userId).set({
        email: email,
        tiss: 'promp'
      });

    } catch (error) {
      setError(error.message);
    }
  };



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
          onPress={handleSubmit}
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