import React from 'react'
import { Button, Text, SafeAreaView } from 'react-native'

export default function Homepage({ navigation }){
    return(
        <SafeAreaView>
            <Text>Main page in the application with "Hello _name_" and options</Text>
            <Button
                title="Go to Settings"
                onPress={() =>
                    navigation.navigate('Settings')
                }
            />
            <Button
                title="Go to personal records"
                onPress={() =>
                    navigation.navigate('Personal Records')
                }
            />
            <Button
                title="Go to User"
                onPress={() =>
                    navigation.navigate('User')
                }
            />
        </SafeAreaView>
            )
}