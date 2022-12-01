import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD6KdmoPLlKYgs_vW_qzsOeSvj0DYaY3XE",
  authDomain: "exerplan.firebaseapp.com",
  projectId: "exerplan",
  storageBucket: "exerplan.appspot.com",
  messagingSenderId: "229441277320",
  appId: "1:229441277320:web:1114355611190433847e3d",
  measurementId: "G-EVFL6CFBNZ"
};

const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);

//export const provider = new GoogleAuthProvider();
//provider.setCustomParameters({ prompt: 'select_account' });