import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import FetchUserData from './FetchUserData';

const FetchGroupData = () => {
    const [groupData, setGroupData] = useState({});
    const [userData] = FetchUserData();

    console.log(userData);

    const getGroupData = async () => {
        try {
            if (auth.currentUser !== null) {
                const docRef = doc(db, "groups", userData.groupid);
                const docSnap = await getDoc(docRef);
                setGroupData([]);
                const data = docSnap.data();
                setGroupData({
                    description: data.description,
                    image: data.image,
                    likes: data.likes,
                    members: data.members,
                    name: data.name
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getGroupData();
        console.log(groupData);
    }, []);
    return [groupData];
};


export default FetchGroupData;