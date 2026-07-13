const idToNameMap = {};
const nameToIdMap = {};

const rosterRawData = [
  ["Chief Name","ID","GiftCodes"," Joined","Time Active","","Signed up","Not Signed up","Contact"],
  ["Sugardaddy",734478972,true,"2026-03-01T08:00:00.000Z","4 months, 12 days","","Bisquick","Dream City",false]
];

for (let i = 1; i < rosterRawData.length; i++) {
  let name = rosterRawData[i][0];
  let id = rosterRawData[i][1];
  if (name && id) {
      idToNameMap[id] = name.toString().trim();
      nameToIdMap[name.toString().trim()] = id.toString().trim();
  }
}

console.log("Map for 734478972: ", idToNameMap["734478972"]);
console.log("Map for '734478972': ", idToNameMap['734478972']);

const users = {
  "some_uid": { gameId: "734478972" }
};

for (const [uid, u] of Object.entries(users)) {
  const cName = idToNameMap[u.gameId] || "Not Found";
  console.log("cName for user:", cName);
}
