
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  deleteDoc, 
  writeBatch,
  getDocs,
  getDoc
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyJFZbwsXXDjuDpDhhjZjLimCZztVe0Ps",
  authDomain: "nosdois-presencaafetiva.firebaseapp.com",
  databaseURL: "https://nosdois-presencaafetiva-default-rtdb.firebaseio.com",
  projectId: "nosdois-presencaafetiva",
  storageBucket: "nosdois-presencaafetiva.firebasestorage.app",
  messagingSenderId: "33760050598",
  appId: "1:33760050598:web:f40bc747f1f4dc842ae367",
  measurementId: "G-X0RQXBYKCN"
};

// Inicializa o app apenas se não houver um já inicializado (evita erro de re-init)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { 
  db, 
  auth, 
  signInAnonymously,
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  deleteDoc, 
  writeBatch,
  getDocs,
  getDoc
};
