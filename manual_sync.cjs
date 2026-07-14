const FIREBASE_URL = "https://wos-dashboard-38d4c-default-rtdb.firebaseio.com";
const FIREBASE_SECRET = "n5fTnxcK5J5ddNsT77AhZIoQGTogW3ROpk4k03Sv";
const API_BASE_URL = "https://script.google.com/macros/s/AKfycbza_zOSCCX244uFfPtE8DWlKHtlCv8193dXZ5nhUsHwM4-1b5AGbFwxiHJxMvXZA_I/exec";
async function syncSheet(sheetName) {
    console.log(`Fetching ${sheetName} from Google Sheets API...`);
    const res = await fetch(`${API_BASE_URL}?api=${encodeURIComponent(sheetName)}`);
    const json = await res.json();
    if (json.success && json.data) {
        console.log(`Successfully fetched ${sheetName}. Pushing to Firebase...`);
        const fbRes = await fetch(`${FIREBASE_URL}/sheets/${encodeURIComponent(sheetName)}.json?auth=${FIREBASE_SECRET}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(json.data)
        });
        if (fbRes.ok) console.log(`Successfully synced ${sheetName} to Firebase!`);
        else console.error(`Failed to push to Firebase:`, await fbRes.text());
    } else console.error(`Failed to fetch ${sheetName} from Google Sheets:`, json);
}
async function run() {
    const sheetsToSync = [
        "schedule",
        "WhiteOut Survival",
        "activity ",
        "News",
        "Chief's List",
        "LeaderBoards",
        "Showdown",
        "Admin Log",
        "giftcodebot"
    ];
    
    for (const sheet of sheetsToSync) {
        await syncSheet(sheet);
    }
    
    console.log('\n? All sheets successfully synced to Firebase!');
}
run();
