// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "x-next-v2-352a7.firebaseapp.com",
  projectId: "x-next-v2-352a7",
  storageBucket: "x-next-v2-352a7.appspot.com",
  messagingSenderId: "817958954279",
  appId: "1:817958954279:web:f09906437859c22c04b502",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
