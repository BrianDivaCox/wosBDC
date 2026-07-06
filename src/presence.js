import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, onDisconnect, set, push, serverTimestamp, runTransaction } from "firebase/database";

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

export function initPresence() {
  const onlineEl = document.getElementById('online-counter');
  const viewsEl = document.getElementById('views-counter');
  
  if (!onlineEl || !viewsEl) return;

  // 1. Manage "Currently Online"
  // Create a reference to this user's specific session
  const myConnectionsRef = push(ref(db, 'presence'));
  
  // When I disconnect, remove this device
  onDisconnect(myConnectionsRef).remove();

  // When I connect, add this device to presence
  const connectedRef = ref(db, '.info/connected');
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      set(myConnectionsRef, true);
    }
  });

  // Listen to total connected users
  const presenceRef = ref(db, 'presence');
  onValue(presenceRef, (snapshot) => {
    let count = 0;
    snapshot.forEach(() => { count++; });
    onlineEl.textContent = count;
  });

  // 2. Manage "Total Views"
  // Increment on load
  const viewsRef = ref(db, 'stats/totalViews');
  runTransaction(viewsRef, (currentViews) => {
    return (currentViews || 0) + 1;
  });

  // Listen to views
  onValue(viewsRef, (snapshot) => {
    viewsEl.textContent = snapshot.val() || 0;
  });
}
