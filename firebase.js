import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBC7WxO_w5rp4BLD6rPjOk7t-DdFrEhdbg",
  authDomain: "earnsphere-arman.firebaseapp.com",
  projectId: "earnsphere-arman",
  storageBucket: "earnsphere-arman.firebasestorage.app",
  messagingSenderId: "549119343166",
  appId: "1:549119343166:web:a17d7c6f3d7862769fef6f",
  measurementId: "G-TZE41C3189"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ===== GLOBAL FIREBASE FUNCTIONS (exposed to window) =====

window._fbAuth = auth;
window._fbDb = db;

// Login with Google
window.loginWithGoogle = async function() {
  const btn = document.querySelector('#loginScreen button[onclick="loginWithGoogle()"]');
  if(btn){ btn.innerHTML='<i style="margin-right:8px">⏳</i>Signing in...'; btn.disabled=true; }
  try {
    await signInWithPopup(auth, provider);
    // onAuthStateChanged will handle the rest
  } catch(err) {
    console.error(err);
    if(btn){ btn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Continue with Google'; btn.disabled=false; }
    alert('Login failed. Please try again.');
  }
};

// Guest login
window.enterApp = function() {
  showLoginScreen(false);
  updateHeaderForGuest();
};

// Logout
window.logoutUser = async function() {
  await signOut(auth);
  savedPlatforms.clear();
  renderCards(platforms);
  updateProfileStats();
  showLoginScreen(true);
};

// Save user data to Firestore
async function saveUserData(uid, data) {
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
  } catch(e){ console.error('Save error:', e); }
}

// Load user data from Firestore
async function loadUserData(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if(snap.exists()) return snap.data();
  } catch(e){ console.error('Load error:', e); }
  return null;
}

// Show/hide login screen
function showLoginScreen(show) {
  const screen = document.getElementById('loginScreen');
  if(show){
    screen.style.display='flex';
    screen.style.opacity='1';
  } else {
    screen.style.transition='opacity 0.5s ease';
    screen.style.opacity='0';
    setTimeout(()=>screen.style.display='none',500);
  }
}

function updateHeaderForUser(user) {
  const headerBtns = document.querySelector('header .flex.items-center.gap-2');
  if(!headerBtns) return;
  // Add user avatar + logout to header
  if(!document.getElementById('headerUserArea')) {
    const area = document.createElement('div');
    area.id = 'headerUserArea';
    area.style.cssText='display:flex;align-items:center;gap:8px';
    area.innerHTML = `
      <img src="${user.photoURL||''}" id="headerAvatar" style="width:30px;height:30px;border-radius:50%;border:2px solid #10b981;object-fit:cover;cursor:pointer" onerror="this.style.display='none'" onclick="showPage('profile')" title="${user.displayName}"/>
      <button onclick="logoutUser()" style="background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer">Logout</button>
    `;
    headerBtns.prepend(area);
  }
}

function updateHeaderForGuest() {
  const headerBtns = document.querySelector('header .flex.items-center.gap-2');
  if(!headerBtns) return;
  if(!document.getElementById('headerUserArea')) {
    const area = document.createElement('div');
    area.id = 'headerUserArea';
    area.innerHTML = `<button onclick="showLoginScreen(true);document.getElementById('loginScreen').style.display='flex';" style="background:rgba(16,185,129,0.15);color:#10b981;border:1px solid rgba(16,185,129,0.25);border-radius:10px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer">Login</button>`;
    headerBtns.prepend(area);
  }
}

// ===== AUTH STATE LISTENER =====
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    showLoginScreen(false);
    updateHeaderForUser(user);

    // Load saved data from Firestore
    const data = await loadUserData(user.uid);
    if(data) {
      // Restore saved platforms
      if(data.savedPlatforms && Array.isArray(data.savedPlatforms)) {
        savedPlatforms = new Set(data.savedPlatforms);
        renderCards(platforms);
        updateProfileStats();
      }
      // Restore profile info
      if(data.displayName || data.name) {
        const nameEl = document.getElementById('editName');
        const profileNameEl = document.getElementById('profileName');
        const n = data.name || data.displayName || user.displayName || '';
        if(nameEl) nameEl.value = n;
        if(profileNameEl) profileNameEl.textContent = n || 'Your Name';
      }
      if(data.bio) {
        const bioEl = document.getElementById('editBio');
        const profileBioEl = document.getElementById('profileBio');
        if(bioEl) bioEl.value = data.bio;
        if(profileBioEl) profileBioEl.textContent = data.bio;
      }
      if(data.goal) {
        const goalEl = document.getElementById('editGoal');
        if(goalEl) goalEl.value = data.goal;
      }
    } else {
      // New user — save initial data
      await saveUserData(user.uid, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        name: user.displayName || '',
        bio: 'EarnSphere Member',
        goal: '',
        savedPlatforms: [],
        createdAt: new Date().toISOString()
      });
      // Pre-fill profile with Google name
      const nameEl = document.getElementById('editName');
      const profileNameEl = document.getElementById('profileName');
      if(nameEl && user.displayName) nameEl.value = user.displayName;
      if(profileNameEl && user.displayName) profileNameEl.textContent = user.displayName;
    }

    // Update profile page with Google photo
    const avatarEl = document.getElementById('profileAvatar');
    if(avatarEl && user.photoURL) {
      avatarEl.innerHTML = '';
      avatarEl.style.background = 'transparent';
      const img = document.createElement('img');
      img.src = user.photoURL;
      img.style.cssText = 'width:80px;height:80px;border-radius:50%;object-fit:cover';
      img.onerror = () => { avatarEl.textContent = '💰'; avatarEl.style.background = 'linear-gradient(135deg,#10b981,#047857)'; };
      avatarEl.appendChild(img);
    }

    // Expose save function globally so toggleSave can call it
    window._currentUserId = user.uid;
    window._saveToFirestore = () => saveUserData(user.uid, {
      savedPlatforms: [...savedPlatforms],
      name: document.getElementById('editName')?.value || user.displayName || '',
      bio: document.getElementById('editBio')?.value || 'EarnSphere Member',
      goal: document.getElementById('editGoal')?.value || ''
    });

  } else {
    // Not signed in — show login screen
    window._currentUserId = null;
    window._saveToFirestore = null;
    if(document.getElementById('headerUserArea')) {
      document.getElementById('headerUserArea').remove();
    }
  }
});

// ===== LOGIN SCREEN POPPING SYMBOLS =====
const _ls=['₿','$','💰','💵','🪙'];
const _lc=['#ffd700','#10b981','#3b82f6','#f59e0b'];
function _spawnL(){
  const c=document.getElementById('loginPopContainer');if(!c)return;
  const el=document.createElement('div');
  el.style.cssText=`position:absolute;pointer-events:none;font-weight:900;opacity:0;left:${5+Math.random()*88}%;bottom:0;font-size:${14+Math.random()*20}px;color:${_lc[Math.floor(Math.random()*_lc.length)]};animation:popUp ${3+Math.random()*4}s linear ${Math.random()*2}s infinite`;
  el.textContent=_ls[Math.floor(Math.random()*_ls.length)];
  c.appendChild(el);setTimeout(()=>el.remove(),7000);
}
for(let i=0;i<10;i++)setTimeout(()=>_spawnL(),i*400);
setInterval(_spawnL,800);

