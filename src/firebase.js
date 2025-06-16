// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAu9h8_fmjUO2JfqDYSGWyvzvbXhGBK7WY",
  authDomain: "social-dashboard-fbf0d.firebaseapp.com",
  projectId: "social-dashboard-fbf0d",
  storageBucket: "social-dashboard-fbf0d.firebasestorage.app",
  messagingSenderId: "184833325701",
  appId: "1:184833325701:web:4854a412eb21add693c7ec",
  measurementId: "G-F7ZK6Z6QLG"
};

// Initialize Firebase 
const app = initializeApp(firebaseConfig); 
export const auth = getAuth(app); 
export const db = getFirestore(app);