import React from 'react'
import { TextInput, View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Button } from 'react-native'

export default function GroupPage() {
    return (
        <Text>Workout planning</Text>
    )


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
        },
    });
}