import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyC7io2boTk45SFj4sDUnxBBk6RAO-RlqpQ",
    authDomain: "food-bride-ai.firebaseapp.com",
    projectId: "food-bride-ai",
    storageBucket: "food-bride-ai.firebasestorage.app",
    messagingSenderId: "74507587516",
    appId: "1:74507587516:web:6b6a6463a288a6446b25b9",
    measurementId: "G-KH19XSD7P7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
