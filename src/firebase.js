import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, onDisconnect, set, push, runTransaction, get } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

export function uploadAvatar(gameId, file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!gameId) return reject(new Error("Game ID is required to upload an avatar"));
    
    // Upload to Firebase Storage
    const avatarRef = storageRef(storage, `avatars/${gameId}.png`);
    const uploadTask = uploadBytesResumable(avatarRef, file);
    
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      }, 
      (error) => {
        // Handle unsuccessful uploads
        reject(error);
      }, 
      async () => {
        // Handle successful uploads on complete
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          // Save URL to Realtime Database so the UI can quickly fetch it
          await set(ref(db, `avatars/${gameId}`), url);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

export async function deleteAvatar(gameId) {
  if (!gameId) return;
  // Remove from Realtime DB
  await set(ref(db, `avatars/${gameId}`), null);
  // Optional: We don't necessarily have to delete from Storage, just unlinking it in DB is enough.
}

export { get, set, ref };
