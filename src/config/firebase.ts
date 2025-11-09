// Firebase setup and configuration for OrderFlow app
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAivGDdEgzRol1mpRY7qbTfpJzoU3nzEb0",
  authDomain: "orderflow-a12aa.firebaseapp.com",
  projectId: "orderflow-a12aa",
  storageBucket: "orderflow-a12aa.firebasestorage.app",
  messagingSenderId: "289630854067",
  appId: "1:289630854067:web:3827ce2c27963d305409c6"
};

// Initialize Firebase app (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Set up authentication (Firebase v12+ handles persistence automatically)
export const auth = getAuth(app);

// Initialize Firestore database
export const db = getFirestore(app);

export default app;