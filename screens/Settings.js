import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { authentication } from '../firebase';
import { signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';

export default function Settings(){

    const navigation = useNavigation()


    const signOutUser = () => {
        signOut(authentication).then(() => {
            // Sign-out successful.
            console.log("signout")
            navigation.replace('Login')
        }).catch((error) => {
        // An error happened.
        console.log(error)
        });
    }

    return(
        <View styles={styles.container}>
            <Text>Email: {authentication.currentUser?.email}</Text>
            <TouchableOpacity
                onPress={signOutUser}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>
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
button: {
  backgroundColor: '#1db954',
  width: '60%',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 40,
},
buttonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 16,
},
})



