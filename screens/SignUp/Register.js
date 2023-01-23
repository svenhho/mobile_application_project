import React, { useState } from 'react';
import { TextInput, Button, View, StyleSheet } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { addDoc, collection } from '@firebase/firestore';
import { auth, db } from '../../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default Register = () => {
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
    <View style={styles.inputContainer}>
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
      <Button style={styles.buttonContainer} title="Sign Up" onPress={handleSubmit} />
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