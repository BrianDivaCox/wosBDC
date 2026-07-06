import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, onDisconnect, set, push, runTransaction } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };

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

// --- Auth & Profile Functions ---
export async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerUser(email, password, gameId) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Link their Game ID in Realtime Database
  await set(ref(db, `users/${user.uid}`), {
    gameId: Number(gameId),
    email: email
  });
  
  return user;
}

export async function logoutUser() {
  return signOut(auth);
}

export function listenToAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get their Game ID
      onValue(ref(db, `users/${user.uid}`), (snap) => {
        const data = snap.val();
        if (data) user.gameId = data.gameId;
        callback(user);
      }, { onlyOnce: true });
    } else {
      callback(null);
    }
  });
}

export async function uploadAvatar(gameId, file) {
  if (!gameId) throw new Error("Game ID is required to upload an avatar");
  // Upload to Firebase Storage
  const avatarRef = storageRef(storage, `avatars/${gameId}.png`);
  await uploadBytes(avatarRef, file);
  const url = await getDownloadURL(avatarRef);
  
  // Save URL to Realtime Database so the UI can quickly fetch it
  await set(ref(db, `avatars/${gameId}`), url);
  return url;
}
