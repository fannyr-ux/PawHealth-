// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxq5kbInF4LrB-7KlLwNGOuEBrT6ZZRLE",
  authDomain: "pawhealthai-a9867.firebaseapp.com",
  projectId: "pawhealthai-a9867",
  storageBucket: "pawhealthai-a9867.firebasestorage.app",
  messagingSenderId: "641081029091",
  appId: "1:641081029091:web:f55be4c5d098cc1fbfb0d6",
  measurementId: "G-0XCBCS3P4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)