import React, { useState } from 'react';
import {
  Text, Image, TextInput, TouchableOpacity, Button, View, StyleSheet, SafeAreaView,
  ScrollView
} from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { doc, setDoc } from '@firebase/firestore';
import { auth, db } from '../../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';


export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState('');
  const groupid = '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selected, setSelected] = React.useState("");

  const genderOptions = [
    { key: '1', value: 'Female' },
    { key: '2', value: 'Male' },
    { key: '3', value: 'Other' },
  ]

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    console.log(image);
  };

  const handleSubmit = async () => {
    try {
      // Create the user with email and password
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", email);


      // Add a new document to the "users" collection with the user's `uid` as the document ID
      await setDoc(userDocRef, {
        email: email,
        firstname: firstName,
        lastname: lastName,
        image: image,
        userid: user.uid,
        groupid: groupid,
      });

      navigation.replace('Login');

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Registration</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="First name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Last name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          <View>
            <TouchableOpacity style={styles.signUp2}
              onPress={pickImage}
            >
              <Text style={styles.signInText2}>Pick an image from camera roll</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.imageContainer} />}
          </View>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.button1}
          >
            <Text style={styles.buttonText1}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUp}
            onPress={() =>
              navigation.replace('Login')
            }
          >
            <Text style={styles.signInText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>

  )

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%'
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  headerText: {
    fontSize: 32,
    color: '#ff5b5b',
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ff5b5b',
    borderRadius: 24,
    paddingLeft: 16,
    marginVertical: 8,
    color: '#ff5b5b',
  },
  selectList: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },

  signUp: {
    alignSelf: 'center',
    marginTop: 10,
  },
  signInText: {
    color: '#ff5a5f',
    fontWeight: 'bold',
  },
  signInText2: {
    color: '#ff5a5f',
  },
  signUp2: {
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  button1: {
    backgroundColor: '#ff5a5f',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonText1: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
