import React from 'react'
import { Button, TextInput, SafeAreaView, StyleSheet } from 'react-native'

export default function Login({ navigation }){
    const loginFunction = () => {
    /** create checks that it is a user */
    return navigation.navigate('Homepage')
    };

    const register = () => {
    console.log("create logic for this")
    }

    return(
        <SafeAreaView>
            <TextInput placeholder='Username' style={styles.input}></TextInput>
            <TextInput placeholder='Password' style={styles.input}></TextInput>
            <Button onPress={loginFunction} title="Log in" style={styles.button}></Button>
            <Button onPress={register} title="Register" style={styles.buttonRegister}></Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    button: {
        color: 'red',
    },
    buttonRegister: {
        color: 'pink',
    },
  })