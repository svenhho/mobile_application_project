import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, SafeAreaView } from 'react-native';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { db, auth } from '../../firebase-config';
import { useNavigation } from '@react-navigation/native';
import FetchUserData from '../../components/FetchUserData';
import CreateNewGroup from './CreateNewGroup';
import FetchGroupData from '../../components/FetchGroupData';
import MatchCard from '../../components/MatchCard';
import { ScrollView } from 'react-native-gesture-handler';


export default function GroupPage() {

    const navigation = useNavigation()

    const [userData] = FetchUserData();
    const [isPartOfGroup, setIsPartOfGroup] = useState(false)
    const [allGroupsData, setGroupData] = useState([]);

    const getGroupData = () => {
        try {
            const groupColRef = collection(db, 'groups');
            onSnapshot(groupColRef, docsSnap => {
                let allDocs = [];
                docsSnap.forEach(doc => {
                    allDocs.push(doc.data());
                });
                setGroupData(allDocs);
            });

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getGroupData();
    }, []);


    const groupStatus = async () => {
        if (userData.groupid == '') {
            setIsPartOfGroup(false);
        }
        else {
            setIsPartOfGroup(true);
        }
        console.log(isPartOfGroup);
    }

    useEffect(() => {
        groupStatus();
    }, []);

    const [currentUserGroup, setCurrentUserGroup] = useState('');
    const [userGroupData, setUserGroupData] = useState([]);

    //console.log(allGroupsData);

    const getUserGroupData = () => {
        try {
            // get current user's group
            const userDocRef = doc(db, 'users', auth.currentUser?.email);
            onSnapshot(userDocRef, snapshot => {
                setCurrentUserGroup(snapshot.data().groupid);
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUserGroupData();
    }, []);

    useEffect(() => {
        if (currentUserGroup) {
            const groupDocRef = doc(db, 'groups', currentUserGroup);
            onSnapshot(groupDocRef, snapshot => {
                setUserGroupData(snapshot.data());
            });
        }
    }, [currentUserGroup]);


    const RenderGroupMembers = () => {
        const [userNames, setUserNames] = useState([]);
        useEffect(() => {
            if (userGroupData.members) {
                const groupMembers = userGroupData.members;
                groupMembers.forEach(member => {
                    const userDocRef = doc(db, 'users', member);
                    onSnapshot(userDocRef, snapshot => {
                        const firstname = snapshot.data().firstname;
                        const lastname = snapshot.data().lastname;
                        setUserNames(prevUserNames => [...prevUserNames, `${firstname} ${lastname}`]);
                    });
                });
            }
        }, []);


        return (
            <View>
                {userNames.map((name, index) => (
                    <Text style={styles.groupMemberstext} key={index}>
                        {name}
                    </Text>
                ))}
            </View>
        );
    };

    const [matchedGroupData, setMatchedGroupData] = useState([]);
    console.log(matchedGroupData);
    const getMatchedGroupData = () => {
        /** 
        const allGroups = allGroupsData;
        const length = allGroupsData.length;
        console.log("THIS IS ALL THE GROUPS", allGroups);
        console.log("THiS IS THE LENGHT OF THAT GROUP", length);
        console.log("User group data", userGroupData);
        const myLikes = userGroupData.likes;
        const myNameId = userGroupData.name;
        const myLikesLength = myLikes.length;
        console.log("mylikes", myLikes);
        console.log("my name ID", myNameId);
        console.log('my length', myLikesLength);
        // iterate through all the groups
        for (let i = 0; i < length; i++){
            
            console.log("object", allGroups[i]);
            const groupObjectName = allGroups[i].name;
            console.log(i, groupObjectName);
            // make sure we dont like our own object
            if(groupObjectName != myNameId){
                const objectLikes = allGroups[i].likes;
                console.log(objectLikes);
                // check if my group name ID is in the object likes list
                for (j = 0; j < objectLikes.length; j++){
                    if(objectLikes[j] == myNameId){
                        // check if my list have the groupObjectName
                        for (k = 0; k < myLikesLength; k++){
                            if(myLikesLength[k] == groupObjectName){
                                console.log("This is a match", groupObjectName);
                                setMatchedGroupData([...matchedGroupData, groupObjectName]);
                            }
                        } 
                    }
                }
            }

        }*/

        allGroupsData.forEach(groupData => {
            if (userGroupData.likes && userGroupData.likes.includes(groupData.name) && groupData.likes.includes(userGroupData.name)) {
                console.log("this is the group data iteration", groupData);
                console.log("Previous matches", matchedGroupData);
                console.log(matchedGroupData.length);
                if (matchedGroupData.length != 0){
                    matchedGroupData.forEach(testingSame => {
                    if (testingSame.name != groupData.name){
                        const dataAdded = groupData;
                        addToMatchArray(dataAdded);
                    }
                })
                } else {
                    const dataAdded = groupData;
                    addToMatchArray(dataAdded);
                }
                console.log("New matched array", matchedGroupData);
            }
        });
    };

    const addToMatchArray = (newValue) => {
        setMatchedGroupData([...matchedGroupData, newValue]);
    }


    useEffect(() => {
        getMatchedGroupData();
    }, []);


    const RenderMatched = () => {

        /**
        const [matchingData, setMatchingData] = useState([]);
            useEffect(() => {
            if (userGroupData) {
                const groupMembers = userGroupData.members;
                groupMembers.forEach(member => {
                    const userDocRef = doc(db, 'groups', member);
                    onSnapshot(userDocRef, snapshot => {
                        const matches = snapshot.data().matches;
                        console.log("this")
                        setMatchingData(prevMatches => [...prevMatches, `${matches}`]);
                    });
                });
            }
        }, []); 

            return (
                <View>
                    {matchedGroupData.map((groupData, index) => (
                                    <MatchCard
                                        key={index}
                                        groupData={groupData}
                                        navigation={navigation}
                                    />
                                ))}
                </View>*/
        return (<View></View>)
    }

    return (
        <SafeAreaView style={styles.container}>
            {userData.groupid == '' ? (
                <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', widht: '40%' }}>
                    <CreateNewGroup /></View>) : (
                <View style={styles.container}>
                    <View style={styles.header}>
                        {/* <Text style={styles.headerTitle}>Group Profile</Text> */}
                    </View>
                    <View style={styles.userContainer}>
                        <Image
                            style={styles.userImage}
                            source={{ uri: userGroupData.image }}
                        />
                        <Text style={styles.userName}>{userGroupData.name}</Text>
                        <Text style={styles.userBio}>{userGroupData.description}</Text>

                    </View>
                    <View style={styles.userContainer}>
                        <Text style={styles.groupMembersTitle}>Group members</Text>
                        <RenderGroupMembers />
                    </View>
                    <View style={styles.userContainer}>
                        <Text style={styles.groupMembersTitle}>Matched groups</Text>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            <RenderMatched />
                            {matchedGroupData.map((groupData, index) => (
                                <MatchCard
                                    key={index}
                                    groupData={groupData}
                                    navigation={navigation}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            )}
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    groupImage: {
        width: 100,
        height: 100,
        borderRadius: 75,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',

        padding: 20,

        backgroundColor: '#fff',
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#ff5b5b',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    createGroupButton: {
        width: '80%',
        height: 48,
        backgroundColor: '#ff5b5b',
        borderRadius: 24,
        marginVertical: 16,
    },
    title: {
        fontSize: 32,
        marginBottom: 48,
        color: '#ff5b5b',
        fontWeight: 'bold',
    },
    userContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    userImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 10,
    },
    userName: {
        fontSize: 25,
        color: '#ff5b5b',
        marginBottom: 10,
        fontWeight: 'bold',
    },

    userBio: {
        textAlign: 'center',
        fontSize: 15,
        color: '#ff5b5b',
        marginHorizontal: 20,
        fontStyle: 'italic'
    },
    groupMembersTitle: {
        fontSize: 15,
        color: '#ff5b5b',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    groupMemberstext: {
        textAlign: 'center',
        fontSize: 15,
        color: '#ff5b5b',
        marginHorizontal: 20,
    },
});
