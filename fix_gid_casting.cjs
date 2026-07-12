const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Cast id to string when populating nameToIdMap
const mapTarget = `              for (let i = 1; i < rosterRawData.length; i++) {
                  let name = rosterRawData[i][0];
                  let id = rosterRawData[i][1];
                  if (name && id) {
                      nameToIdMap[name.toString().trim()] = id;
                  }
              }`;

const mapNew = `              for (let i = 1; i < rosterRawData.length; i++) {
                  let name = rosterRawData[i][0];
                  let id = rosterRawData[i][1];
                  if (name && id) {
                      nameToIdMap[name.toString().trim()] = id.toString().trim();
                  }
              }`;

content = content.replace(mapTarget, mapNew);

// 2. Cast u.gameId to string in registeredGameIds Set
const setTarget = `          const registeredGameIds = new Set();
          if (usersSnap && usersSnap.val()) {
              Object.values(usersSnap.val()).forEach(u => {
                  if (u.gameId) registeredGameIds.add(u.gameId);
              });
          }`;

const setNew = `          const registeredGameIds = new Set();
          if (usersSnap && usersSnap.val()) {
              Object.values(usersSnap.val()).forEach(u => {
                  if (u.gameId) registeredGameIds.add(u.gameId.toString().trim());
              });
          }`;

content = content.replace(setTarget, setNew);

fs.writeFileSync('main.js', content, 'utf8');
console.log("Applied string casting to Game IDs.");
