import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD6xvtf7GRiCz0CazRTf9WNmHfWYbMDvlI",
  authDomain: "gen-lang-client-0469091192.firebaseapp.com",
  projectId: "gen-lang-client-0469091192",
  storageBucket: "gen-lang-client-0469091192.firebasestorage.app",
  messagingSenderId: "935651895215",
  appId: "1:935651895215:web:5b9bc814c7eb4a7508f15a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-200659df-3cfd-4d84-ad0b-f6dce11c6edc");
const auth = getAuth(app);

export { db, auth, collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc, setDoc, getDoc, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };
