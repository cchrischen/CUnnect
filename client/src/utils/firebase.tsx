import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
    apiKey: "AIzaSyAC9pQQ2s1hCPGgOPK3TqnKFqDtMBzdaM8",
    authDomain: "final-project-c8992.firebaseapp.com",
    projectId: "final-project-c8992",
    storageBucket: "final-project-c8992.appspot.com",
    messagingSenderId: "623878779988",
    appId: "1:623878779988:web:714b3275ea1677b96f29c1"
};

initializeApp(config);

const auth = getAuth();

export { auth };