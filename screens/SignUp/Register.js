import React, { useState } from 'react';
import { Text, Image, TextInput, TouchableOpacity, Button, View, StyleSheet } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { doc, setDoc } from '@firebase/firestore';
import { auth, db } from '../../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { signOut } from "firebase/auth";


export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [image, setImage] = useState('');
  const groupid = [];
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
  const handleSubmit = async () => {
    signOutUser();
    try {
      // Create the user with email and password
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", email);


      // Add a new document to the "users" collection with the user's `uid` as the document ID
      await setDoc(userDocRef, {
        email: email,
        firstname: firstName,
        lastname: lastName,
        gender: gender,
        age: age,
        image: image,
        userid: user.uid,
        groupid: groupid
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
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
      <SelectList
        placeholder="Gender"
        setSelected={(val) => setGender(val)}
        data={genderOptions}
        style={styles.input}
        save="value"
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        style={styles.input}
      />
      <View style={styles.modalInput}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
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
      <Button
        buttonStyle={styles.signUpButton}
        title="Sign up"
        onPress={handleSubmit}
      />
      <TouchableOpacity style={styles.signUp}
        onPress={() =>
          navigation.replace('Login')
        }
      >
        <Text style={styles.signInText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
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
  signUpButton: {
    backgroundColor: '#ff5a5f',
    borderRadius: 5,
    margin: 10,
    alignSelf: 'center',
    width: '80%'
  },
  signUp: {
    alignSelf: 'center',
    marginTop: 10,
  },
  signInText: {
    color: '#ff5a5f',
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
});
