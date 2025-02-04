import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuy-rQVjDlIoIuw4OLD4i2W5JcOGV5ryw",
  authDomain: "userauthenticater.firebaseapp.com",
  projectId: "userauthenticater",
  storageBucket: "userauthenticater.firebasestorage.app",
  messagingSenderId: "330272277965",
  appId: "1:330272277965:web:37d9435c09187a0c29b084",
  measurementId: "G-KCTBL1DHM9",
};

const app = initializeApp(firebaseConfig);

export {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  deleteUser,
  app,
};
