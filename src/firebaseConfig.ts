import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { User } from "firebase/auth"; // type-only import

const firebaseConfig = {
  apiKey: "AIzaSyBB82d_izoVVvjZ-1nhG3sKJQ0kGzq_eFE",
  authDomain: "msc-msit-announcements.firebaseapp.com",
  projectId: "msc-msit-announcements",
  storageBucket: "msc-msit-announcements.firebasestorage.app",
  messagingSenderId: "437052740104",
  appId: "1:437052740104:web:c5d7f62fdea36580daf7bd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
  }
};
