// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNQjF9eFh9qg3cvZnXFYc7wBZFImxJYDQ",
  authDomain: "housing-project-ac453.firebaseapp.com",
  databaseURL: "https://housing-project-ac453-default-rtdb.firebaseio.com",
  projectId: "housing-project-ac453",
  storageBucket: "housing-project-ac453.firebasestorage.app",
  messagingSenderId: "3580671491",
  appId: "1:3580671491:web:7bd86b8cabb4b737ea8036",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
