const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Remove usersSnap from Promise.all in views.roster
const rosterRegex = /const \[data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData, usersSnap\] = await Promise\.all\(\[\n\s*fetchSheet\("activity "\),\n\s*fetchSheet\("Chief's List"\),\n\s*fetchSheet\("LeaderBoards"\),\n\s*fetchSheet\("Showdown History"\),\n\s*fetchSheet\("Showdown"\),\n\s*get\(ref\(db, 'users'\)\)\n\s*\]\);/g;

content = content.replace(rosterRegex, `const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData] = await Promise.all([
            fetchSheet("activity "),
            fetchSheet("Chief's List"),
            fetchSheet("LeaderBoards"),
            fetchSheet("Showdown History"),
            fetchSheet("Showdown")
          ]);
        
        let usersSnap = null;
        try { usersSnap = await get(ref(db, 'users')); } catch(e) { console.warn("Could not fetch users:", e); }`);

// 2. Populate nameToIdMap before rendering options
const sortingBlockTarget = `// Sort players alphabetically for the dropdown
          players.sort((a, b) => a[0].toString().localeCompare(b[0].toString()));
          
          const registeredGameIds = new Set();`;

const sortingBlockNew = `// Populate nameToIdMap so we can match names to Game IDs
          if (rosterRawData && rosterRawData.length > 0) {
              for (let i = 1; i < rosterRawData.length; i++) {
                  let name = rosterRawData[i][0];
                  let id = rosterRawData[i][1];
                  if (name && id) {
                      nameToIdMap[name.toString().trim()] = id;
                  }
              }
          }

        // Sort players alphabetically for the dropdown
          players.sort((a, b) => a[0].toString().localeCompare(b[0].toString()));
          
          const registeredGameIds = new Set();`;

content = content.replace(sortingBlockTarget, sortingBlockNew);

fs.writeFileSync('main.js', content, 'utf8');
console.log("Fixes applied successfully.");
