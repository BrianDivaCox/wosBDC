const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8').replace(/\r\n/g, '\n');

// The exact string inside searchPlayerFull (should NOT have usersSnap)
let searchRegex = /const \[data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData, usersSnap\] = await Promise\.all\(\[\n\s*fetchSheet\("activity "\),\n\s*fetchSheet\("Chief's List"\),\n\s*fetchSheet\("LeaderBoards"\),\n\s*fetchSheet\("Showdown History"\),\n\s*fetchSheet\("Showdown"\),\n\s*get\(ref\(db, 'users'\)\)\n\s*\]\);/g;

content = content.replace(searchRegex, `const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData] = await Promise.all([
        fetchSheet("activity "),
        fetchSheet("Chief's List"),
        fetchSheet("LeaderBoards"),
        fetchSheet("Showdown History"),
        fetchSheet("Showdown")
      ]);`);

// The exact string inside views.roster (should HAVE usersSnap)
let rosterRegex = /const \[data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData\] = await Promise\.all\(\[\n\s*fetchSheet\("activity "\),\n\s*fetchSheet\("Chief's List"\),\n\s*fetchSheet\("LeaderBoards"\),\n\s*fetchSheet\("Showdown History"\),\n\s*fetchSheet\("Showdown"\)\n\s*\]\);/g;

content = content.replace(rosterRegex, `const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData, usersSnap] = await Promise.all([
          fetchSheet("activity "),
          fetchSheet("Chief's List"),
          fetchSheet("LeaderBoards"),
          fetchSheet("Showdown History"),
          fetchSheet("Showdown"),
          get(ref(db, 'users'))
        ]);`);

fs.writeFileSync('main.js', content, 'utf8');
console.log("Regex replace complete.");
