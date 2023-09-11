import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import 'firebase/compat/firestore';

// Initialize Firebase
export const app = firebase.initializeApp( {
  apiKey: "AIzaSyClGLldKVct3o1Orvc45PhVfxNTopqpczc",
  authDomain: "todo-bb047.firebaseapp.com",
  projectId: "todo-bb047",
  storageBucket: "todo-bb047.appspot.com",
  messagingSenderId: "416119242813",
  appId: "1:416119242813:web:455cc050897918ecbc6a54"
});

export const storage = firebase.storage;
export const db = firebase.firestore();
export const auth = firebase.auth()
