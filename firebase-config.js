import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQBLLt8JirqcenkMAEzz69HCABytJmRjI",
  authDomain: "soluciones-estevez-intranet.firebaseapp.com",
  projectId: "soluciones-estevez-intranet",
  storageBucket: "soluciones-estevez-intranet.appspot.com",
  messagingSenderId: "133562810227",
  appId: "1:133562810227:web:7ac6397537e457c5618f06"
   measurementId: "G-ZM62BNVK3H"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
