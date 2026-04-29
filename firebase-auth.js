// আপনার Firebase কনফিগারেশন এখানে পেস্ট করুন
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx", // <-- এই লাইনগুলো আপনার আসল কনফিগারেশন দিয়ে প্রতিস্থাপন করুন
  authDomain: "earnsphere-arman.firebaseapp.com",
  projectId: "earnsphere-arman",
  storageBucket: "earnsphere-arman.appspot.com",
  messagingSenderId: "xxxxxxxxxxxx",
  appId: "1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxx",
  measurementId: "G-XXXXXXXXXX"
};

// firebase-auth.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// আপনার Firebase কনফিগারেশন এখানে পেস্ট করুন
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY", // <--- এটি আপনার Firebase কনসোল থেকে প্রাপ্ত আসল apiKey হবে
  authDomain: "your-project-id.firebaseapp.com", // <--- এটি আপনার আসল authDomain
  projectId: "your-project-id", // <--- এটি আপনার আসল projectId
  storageBucket: "your-project-id.appspot.com", // <--- এটি আপনার আসল storageBucket
  messagingSenderId: "YOUR_SENDER_ID", // <--- এটি আপনার আসল messagingSenderId
  appId: "YOUR_APP_ID", // <--- এটি আপনার আসল appId
  measurementId: "YOUR_MEASUREMENT_ID" // <--- এটি আপনার আসল measurementId
};

// Firebase অ্যাপ ইনিশিয়ালাইজ করুন
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ... (বাকি কোড যেমন আছে তেমনই থাকবে)
