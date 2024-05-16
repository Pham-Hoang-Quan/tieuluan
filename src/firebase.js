// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMRveJEXGjD7btnzLrJqE_UmwtC-ERzd8",
  authDomain: "vote-f62d0.firebaseapp.com",
  projectId: "vote-f62d0",
  storageBucket: "vote-f62d0.appspot.com",
  messagingSenderId: "345286074174",
  appId: "1:345286074174:web:1588215f700a6db433d66f",
  measurementId: "G-5T8G6C628W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);