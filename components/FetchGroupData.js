import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

const FetchGroupData = (groupid) => {
    const [groupData, setGroupData] = useState({});

    const getGroupData = async () => {
        try {
            if (auth.currentUser !== null) {
                const docRef = doc(db, "groups", groupid);
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