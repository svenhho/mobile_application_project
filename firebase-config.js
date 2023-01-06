import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from '@firebase/firestore';



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6KdmoPLlKYgs_vW_qzsOeSvj0DYaY3XE",
  authDomain: "exerplan.firebaseapp.com",
  projectId: "exerplan",
  storageBucket: "exerplan.appspot.com",
  messagingSenderId: "229441277320",
  appId: "1:229441277320:web:1114355611190433847e3d",
  measurementId: "G-EVFL6CFBNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);