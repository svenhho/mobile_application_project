import React, { useState, useEffect } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

const FetchGroupData = () => {
    const [groupData, setGroupData] = useState({});


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
    return [groupData];
};


export default FetchGroupData;
