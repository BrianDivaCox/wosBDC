const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxXjDN5nXVsdojTudMtChy4ts6l4fckyKZGRTa7f689IiI8giejnzys4bnlIZaL28g/exec';

async function fetchSheet(sheetName) {
    const res = await fetch(`${API_BASE_URL}?sheet=${encodeURIComponent(sheetName)}`);
    const data = await res.json();
    return data;
}

async function test() {
    console.log("Fetching sheets...");
    const roster = await fetchSheet("Chief's List");
    const activity = await fetchSheet("activity ");
    
    let nameToIdMap = {};
    for (let i = 1; i < roster.length; i++) {
        let name = roster[i][0];
        let id = roster[i][1];
        if (name && id) {
            nameToIdMap[name.toString().trim()] = id.toString().trim();
        }
    }
    
    console.log("Thadwarf in Chief's List:", Object.keys(nameToIdMap).find(k => k.toLowerCase().includes('tha')));
    console.log("Thadwarf ID:", nameToIdMap["Thadwarf"]);
    
    let activityNames = [];
    for (let i = 1; i < activity.length; i++) {
        let name = activity[i][0];
        if (name && name.toString().trim() !== "") {
            activityNames.push(name.toString().trim());
        }
    }
    
    console.log("Thadwarf in Activity:", activityNames.find(k => k.toLowerCase().includes('tha')));
    
    let isReg = false;
    let gid = nameToIdMap["Thadwarf"];
    
    const registeredGameIds = new Set();
    registeredGameIds.add("705413646"); // Thadwarf ID from firebase
    registeredGameIds.add("318843189"); // Brian ID from firebase
    registeredGameIds.add("697738681"); // Tyee ID from firebase
    
    console.log("Has gid?", registeredGameIds.has(gid));
}
test();
