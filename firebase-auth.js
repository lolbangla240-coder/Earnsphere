// firebase-auth.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// --- গুরুত্বপূর্ণ: এখানে আপনার আসল Firebase কনফিগারেশন পেস্ট করুন ---
const firebaseConfig = {
 apiKey: "AIzaSyBC7WxO_w5rp4BLD6rPjOk7t-DdFrEhdbg",

  authDomain: "earnsphere-arman.firebaseapp.com",

  projectId: "earnsphere-arman",

  storageBucket: "earnsphere-arman.firebasestorage.app",

  messagingSenderId: "549119343166",

  appId: "1:549119343166:web:a17d7c6f3d7862769fef6f",

  measurementId: "G-TZE41C3189"

};
// ------------------------------------------------------------------

// Firebase অ্যাপ ইনিশিয়ালাইজ করুন
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign-in ফাংশন
window.signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    // UI আপডেট onAuthStateChanged হ্যান্ডেল করবে
  } catch (error) {
    console.error('Google Sign-in Error:', error.code, error.message);
    alert('Google Sign-in failed: ' + error.message);
  }
};

// Sign-out ফাংশন
window.signOutUser = async () => {
  try {
    await signOut(auth);
    // UI আপডেট onAuthStateChanged হ্যান্ডেল করবে
  } catch (error) {
    console.error('Sign-out Error:', error.code, error.message);
    alert('Sign-out failed: ' + error.message);
  }
};

// প্রমাণীকরণ অবস্থার পরিবর্তন পর্যবেক্ষণ করুন
onAuthStateChanged(auth, (user) => {
  const profileNameEl = document.getElementById('profileName');
  const profileBioEl = document.getElementById('profileBio');
  const userProfilePictureEl = document.getElementById('userProfilePicture');
  const profileAvatarEl = document.getElementById('profileAvatar');
  const authStatusEl = document.getElementById('authStatus');
  const avatarChangeButtonEl = document.getElementById('avatarChangeButton');
  const editNameEl = document.getElementById('editName');
  const editBioEl = document.getElementById('editBio');

  if (user) {
    // ব্যবহারকারী লগইন করা আছে
    console.log('User is logged in:', user.displayName, user.email, user.photoURL);

    // প্রোফাইল ছবি এবং নাম আপডেট করুন
    if (userProfilePictureEl) {
      if (user.photoURL) {
        userProfilePictureEl.src = user.photoURL;
        userProfilePictureEl.style.display = 'block';
        if (profileAvatarEl) profileAvatarEl.style.display = 'none'; // ডিফল্ট অবতার লুকান
        if (avatarChangeButtonEl) avatarChangeButtonEl.style.display = 'none'; // আভাটার পরিবর্তনের বাটন লুকান
      } else {
        userProfilePictureEl.style.display = 'none';
        if (profileAvatarEl) profileAvatarEl.style.display = 'flex'; // ডিফল্ট অবতার দেখান
        if (avatarChangeButtonEl) avatarChangeButtonEl.style.display = 'flex'; // আভাটার পরিবর্তনের বাটন দেখান
      }
    }

    if (profileNameEl) profileNameEl.textContent = user.displayName || 'Google User';
    if (profileBioEl) profileBioEl.textContent = user.email || 'Logged in with Google';

    // সাইন-আউট বাটন দেখান
    if (authStatusEl) {
      authStatusEl.innerHTML = `
        <div style="font-size:14px; margin-bottom:10px;">Logged in as: <span style="font-weight:bold;">${user.displayName || user.email}</span></div>
        <button onclick="signOutUser()" class="gbtn" style="padding:10px 24px;border-radius:12px;font-size:14px;font-weight:700">
          Sign Out
        </button>
      `;
    }
    // "Edit Profile" ইনপুটগুলি আপডেট করুন
    if (editNameEl) editNameEl.value = user.displayName || '';
    if (editBioEl) editBioEl.value = ''; // Google ব্যবহারকারীর জন্য Bio খালি রাখুন

  } else {
    // ব্যবহারকারী লগআউট করা আছে
    console.log('User is signed out.');

    // ডিফল্ট প্রোফাইল তথ্য দেখান
    if (userProfilePictureEl) userProfilePictureEl.style.display = 'none';
    if (profileAvatarEl) profileAvatarEl.style.display = 'flex';
    if (avatarChangeButtonEl) avatarChangeButtonEl.style.display = 'flex'; // আভাটার পরিবর্তনের বাটন দেখান

    if (profileNameEl) profileNameEl.textContent = 'Your Name';
    if (profileBioEl) profileBioEl.textContent = 'EarnSphere Member';

    // সাইন-ইন বাটন দেখান
    if (authStatusEl) {
      authStatusEl.innerHTML = `
        <button onclick="signInWithGoogle()" class="gbtn" style="padding:10px 24px;border-radius:12px;font-size:14px;font-weight:700">
          <i class="fa-brands fa-google" style="margin-right:8px"></i> Sign in with Google
        </button>
      `;
    }
    // "Edit Profile" ইনপুটগুলি রিসেট করুন
    if (editNameEl) editNameEl.value = '';
    if (editBioEl) editBioEl.value = '';
  }
});
