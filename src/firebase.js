// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAUaZyt9xvSVUt9GaW3ayZKUxnAZiFNjcs",
  authDomain: "hci-final-project-c0074.firebaseapp.com",
  projectId: "hci-final-project-c0074",
  storageBucket: "hci-final-project-c0074.firebasestorage.app",
  messagingSenderId: "271755850528",
  appId: "1:271755850528:web:191ff22945b132e2959d45",
  measurementId: "G-G22D2NDDBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication, Firestore, and Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
