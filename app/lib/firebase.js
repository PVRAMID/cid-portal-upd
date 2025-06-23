// app/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const storage = getStorage(app);

// Helper to format Firestore Timestamps
const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
};

// Helper to get status colors
const getStatusColor = (status) => {
    switch (status) {
        case 'Open':
            return 'bg-green-500 text-white';
        case 'Closed':
            return 'bg-red-500 text-white';
        case 'Pending Review':
            return 'bg-yellow-500 text-white';
        case 'Case Cold':
            return 'bg-blue-500 text-white';
        case 'Suspended by Supervisors':
            return 'bg-purple-500 text-white';
        case 'Hold - LOA':
            return 'bg-orange-500 text-white';
        case 'Hold - No Lead Detective':
            return 'bg-orange-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

export { auth, db, storage, formatTimestamp, getStatusColor };