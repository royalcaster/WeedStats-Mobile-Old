/* import firebase from "firebase/compat/app";
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBAlbSfcLmsqz9S_W4J_TCsX_i481My9MM",
    authDomain: "weedstats-1a033.firebaseapp.com",
    projectId: "weedstats-1a033",
    storageBucket: "weedstats-1a033.appspot.com",
    messagingSenderId: "158741630717",
    appId: "1:158741630717:web:6c226c2bae4f89c0c6f894",
    measurementId: "G-CFR1K51QGK"
  };

// Initialize Firebase 
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase */