import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyCk-gl95H9PCpHQ8KsLS7A_3mqLEqQo1X8",
  authDomain: "cunnect-861bb.firebaseapp.com",
  projectId: "cunnect-861bb",
  storageBucket: "cunnect-861bb.appspot.com",
  messagingSenderId: "1005651194776",
  appId: "1:1005651194776:web:c75df66995782c05b0b1ed"
};

const app = initializeApp(config);

const auth = getAuth();

const db = getFirestore(app);

export { auth, db };
