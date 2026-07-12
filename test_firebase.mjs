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
    try {
        console.log("Fetching /users...");
        const snap = await get(ref(db, 'users'));
        if (snap.exists()) {
            console.log("Success! Object keys count:", Object.keys(snap.val()).length);
            let firstUser = Object.values(snap.val())[0];
            console.log("Sample user:", Object.keys(firstUser));
        } else {
            console.log("No data at /users.");
        }
    } catch(e) {
        console.error("Error fetching:", e.message);
    }
    process.exit(0);
}
testFetch();
