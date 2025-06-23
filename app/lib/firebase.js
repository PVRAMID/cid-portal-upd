import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration - REPLACE WITH YOURS
const firebaseConfig = {
  apiKey: "AIzaSyCq2jkYEqH35eDh6fEEsYNHPtWPppp-xvw",
  authDomain: "cid-portal.firebaseapp.com",
  projectId: "cid-portal",
  storageBucket: "cid-portal.appspot.com",
  messagingSenderId: "221164463425",
  appId: "1:221164463425:web:e41dbe250b4c466b23edc0",
  measurementId: "G-GX6XCDNS3X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper to format Firestore Timestamps
const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
};

export { auth, db, formatTimestamp };
