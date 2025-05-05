// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0uP7MHUJhqH0eRbqWo451SkwuEPfDdJo",
  authDomain: "deeptiart-com.firebaseapp.com",
  databaseURL: "https://deeptiart-com-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "deeptiart-com",
  storageBucket: "deeptiart-com.firebasestorage.app",
  messagingSenderId: "443200722891",
  appId: "1:443200722891:web:81a80245545793928c084e",
  measurementId: "G-S9N7CNXNY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const firestore = getFirestore(app);
const analytics = getAnalytics(app);


export { auth, analytics, firestore , firebaseConfig};
