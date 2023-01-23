import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, Button, View, StyleSheet } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { addDoc, collection } from '@firebase/firestore';
import { auth, db } from '../../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';


export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [selected, setSelected] = React.useState("");

  const genderOptions = [
    { key: '1', value: 'Female' },
    { key: '2', value: 'Male' },
    { key: '3', value: 'Other' },
  ]



  const handleSubmit = async () => {

    try {
      // Create the user with email and password
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Add a new document to the "users" collection with the user's `uid` as the document ID
      await addDoc(collection(db, 'users'), {
        email: email,
        firstname: firstName,
        lastname: lastName,
        gender: gender,
        age: age,
        userid: user.uid
      }, user.uid);
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
    width: '80%',
    height: 48,
    backgroundColor: '#ff5b5b',
    borderRadius: 24,
    marginVertical: 16,
  },
  signIn: {
    alignSelf: 'center',
  },
  signInText: {
    color: '#ff5b5b',
  },
});
