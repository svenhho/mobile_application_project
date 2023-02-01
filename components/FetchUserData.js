import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

const FetchUserData = () => {
  const [userData, setUserData] = useState({});

  const getUserData = async () => {
    try {
      // get current user's group
      const userDocRef = doc(db, 'users', auth.currentUser?.email);
      onSnapshot(userDocRef, snapshot => {
        setUserData(snapshot.data());
      });


    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return [userData];
};

export default FetchUserData;
