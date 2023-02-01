import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

const FetchCurrentUserGroup = () => {
    const [currentUserGroup, setCurrentUserGroup] = useState('');
    const [userGroupData, setUserGroupData] = useState([]);

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
    }, [userGroupData]);

};

export default FetchCurrentUserGroup;
