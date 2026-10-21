// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernproject-with-aiagent.firebaseapp.com",
  projectId: "mernproject-with-aiagent",
  storageBucket: "mernproject-with-aiagent.firebasestorage.app",
  messagingSenderId: "558158219681",
  appId: "1:558158219681:web:76bcc9afa5cce52bfbe3e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()