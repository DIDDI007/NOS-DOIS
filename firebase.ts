
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Suas credenciais reais integradas
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

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
