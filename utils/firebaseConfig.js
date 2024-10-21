import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // Importing Firebase Auth

const firebaseConfig = {
  apiKey: 'AIzaSyDdClopB_iRI-UCm228U7a8yPLPCooZwEA',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: 'glenview2-b3d45',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app); // Initializing the auth service

// Exporting services
export { database, storage, auth }; // Ensure auth is exported
