import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, onDisconnect, set, push, runTransaction, get } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuw51XRkUz5sbr-i8DKiGUgMpAPSiR-vs",
  authDomain: "wos-dashboard-38d4c.firebaseapp.com",
  databaseURL: "https://wos-dashboard-38d4c-default-rtdb.firebaseio.com",
  projectId: "wos-dashboard-38d4c",
  storageBucket: "wos-dashboard-38d4c.firebasestorage.app",
  messagingSenderId: "1041082078621",
  appId: "1:1041082078621:web:9cce2bb45b76fb86404b74",
  measurementId: "G-8SZCNHML68"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export function initPresence() {
  const onlineEl = document.getElementById('online-counter');
  const viewsEl = document.getElementById('views-counter');
  
  if (!onlineEl || !viewsEl) return;

  // 1. Manage "Currently Online"
  const myConnectionsRef = push(ref(db, 'presence'));
  onDisconnect(myConnectionsRef).remove();

  const connectedRef = ref(db, '.info/connected');
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      set(myConnectionsRef, true);
    }
  });

  const presenceRef = ref(db, 'presence');
  onValue(presenceRef, (snapshot) => {
    let count = 0;
    snapshot.forEach(() => { count++; });
    onlineEl.textContent = count;
  });

  // 2. Manage "Total Views"
  const viewsRef = ref(db, 'stats/totalViews');
  runTransaction(viewsRef, (currentViews) => {
    return (currentViews || 0) + 1;
  });

  onValue(viewsRef, (snapshot) => {
    viewsEl.textContent = snapshot.val() || 0;
  });
}

// Authentication
export function listenToAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const usersRef = ref(db, `users/${user.uid}`);
      onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val());
        } else {
          callback(null);
        }
      }, { onlyOnce: true });
    } else {
      callback(null);
    }
  });
}

export async function registerUser(email, password, gameId) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Save user profile in Realtime Database mapped by UID
  await set(ref(db, `users/${user.uid}`), {
    email: user.email,
    gameId: gameId,
    createdAt: new Date().toISOString()
  });
  
  return user;
}

export async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  return signOut(auth);
}

// Avatar Management using Base64 String
export async function uploadAvatar(gameId, base64String) {
  if (!gameId) throw new Error("Game ID is required to upload an avatar");
  if (!base64String) throw new Error("Image data is missing");
  
  // Save Base64 string directly to Realtime Database
  await set(ref(db, `avatars/${gameId}`), base64String);
  return base64String;
}

export async function deleteAvatar(gameId) {
  if (!gameId) return;
  // Remove from Realtime DB
  await set(ref(db, `avatars/${gameId}`), null);
}

export { get, set, ref, db };
