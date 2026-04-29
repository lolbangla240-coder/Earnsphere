import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// আপনার Firebase কনফিগারেশন
const firebaseConfig = {
  // ... আপনার কনফিগারেশন এখানে ...
};

// Firebase অ্যাপ ইনিশিয়ালাইজ করুন
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Sign-in শুরু করুন
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // সাইন-ইন সফল হয়েছে
    const user = result.user;
    console.log('User signed in:', user);
    // আপনার অ্যাপের UI আপডেট করুন বা অন্য কিছু করুন
  } catch (error) {
    // ত্রুটি হ্যান্ডেল করুন
    console.error('Google Sign-in error:', error);
  }
};

// বোতামের সাথে ইভেন্ট লিসেনার যোগ করুন
document.getElementById('signInButton').addEventListener('click', signInWithGoogle);
