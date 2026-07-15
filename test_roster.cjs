const fs = require('fs');
async function test() {
  const usersRaw = await fetch("https://wos-dashboard-38d4c-default-rtdb.firebaseio.com/users.json").then(r => r.json());
  const ChiefList = await fetch("https://wos-dashboard-38d4c-default-rtdb.firebaseio.com/sheets/Chief's%20List.json").then(r => r.json());
  const activity = await fetch("https://wos-dashboard-38d4c-default-rtdb.firebaseio.com/sheets/activity%20.json").then(r => r.json());

  console.log("Users:", Object.keys(usersRaw || {}).length);
  console.log("ChiefList length:", ChiefList ? ChiefList.length : "null");
  console.log("activity length:", activity ? activity.length : "null");

  const registeredGameIds = new Set();
  Object.values(usersRaw).forEach(u => {
    if (u.gameId) registeredGameIds.add(u.gameId.toString().trim());
    if (u.linkedGameIds && Array.isArray(u.linkedGameIds)) {
        u.linkedGameIds.forEach(id => registeredGameIds.add(id.toString().trim()));
    }
  });
  console.log("Registered GameIDs:", registeredGameIds.size);

  const nameToIdMap = {};
  for (let i = 1; i < ChiefList.length; i++) {
    let name = ChiefList[i][0];
    let id = ChiefList[i][1];
    if (name && id) nameToIdMap[name.toString().trim()] = id.toString().trim();
  }
  console.log("nameToIdMap keys:", Object.keys(nameToIdMap).length);

  const players = [];
  for (let i = 1; i < activity.length; i++) {
    if (activity[i][0] && activity[i][0].toString().trim() !== "") {
      players.push(activity[i]);
    }
  }
  console.log("Players from activity:", players.length);

  let optsHtml = 0;
  players.forEach((p, i) => {
    let name = p[0].toString().trim();
    let isReg = false;
    let gid = nameToIdMap[name];
    if (gid && registeredGameIds.has(gid.toString().trim())) isReg = true;
    
    // Simulate globalRosterRegisteredOnly = true
    if (true && !isReg) return;
    optsHtml++;
  });
  
  console.log("Options generated if Reg Only:", optsHtml);
}
test();
