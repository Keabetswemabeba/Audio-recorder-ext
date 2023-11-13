// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import{getFirestore} from "firebase/firestore"
import{getStorage} from "firebase/storage";
import {getAuth} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyDptvaUua6VqONYXCfZANWIoaon5ytcsoo",
  authDomain: "audio-app-4b919.firebaseapp.com",
  projectId: "audio-app-4b919",
  storageBucket: "audio-app-4b919.appspot.com",
  messagingSenderId: "1007317099899",
  appId: "1:1007317099899:web:402a2adf6eeb7ebccb89de",
  measurementId: "G-01D6YLQJ6M"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage,auth}

