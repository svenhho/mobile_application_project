import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

const FetchUserData = () => {
  const [userData, setUserData] = useState({});

  const getUserData = async () => {
    try {
      if (auth.currentUser !== null) {
        const docRef = doc(db, "users", auth.currentUser.email);
        const docSnap = await getDoc(docRef);
        setUserData([]);
        const data = docSnap.data();
        setUserData({
          age: data.age,
          email: data.email,
          firstname: data.firstname,
          gender: data.gender,
          groupid: data.groupid,
          image: data.image,
          lastname: data.lastname,
          userid: data.userid
        });
      }
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
