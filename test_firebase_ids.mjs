import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBuw51XRkUz5sbr-i8DKiGUgMpAPSiR-vs",
    authDomain: "wos-dashboard-38d4c.firebaseapp.com",
    databaseURL: "https://wos-dashboard-38d4c-default-rtdb.firebaseio.com",
    projectId: "wos-dashboard-38d4c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function testFetch() {
    const snap = await get(ref(db, 'users'));
    let users = snap.val();
    Object.keys(users).forEach(k => {
        let u = users[k];
        console.log(`Email: ${u.email}, GameId: ${u.gameId}, Type: ${typeof u.gameId}`);
    });
    process.exit(0);
}
testFetch();
