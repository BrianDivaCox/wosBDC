const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8').replace(/\r\n/g, '\n');

// Update views.roster
const rosterStartStr = `    roster: async () => {`;
const promiseStartStr = `const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData`;
const promiseEndStr = `]);`;

let rIndex = content.indexOf(rosterStartStr);
let pStartIndex = content.indexOf(promiseStartStr, rIndex);
let pEndIndex = content.indexOf(promiseEndStr, pStartIndex) + promiseEndStr.length;

let newPromise = `const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData, usersSnap] = await Promise.all([
          fetchSheet("activity "),
          fetchSheet("Chief's List"),
          fetchSheet("LeaderBoards"),
          fetchSheet("Showdown History"),
          fetchSheet("Showdown"),
          get(ref(db, 'users'))
        ]);`;

content = content.substring(0, pStartIndex) + newPromise + content.substring(pEndIndex);

// Revert searchPlayerFull (which is before views.roster)
const searchPromiseStartStr = `const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData, usersSnap] = await Promise.all([`;
let searchIndex = content.indexOf(searchPromiseStartStr);
if (searchIndex !== -1 && searchIndex < rIndex) {
    let sEndIndex = content.indexOf(promiseEndStr, searchIndex) + promiseEndStr.length;
    let oldPromise = `const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData] = await Promise.all([
        fetchSheet("activity "),
        fetchSheet("Chief's List"),
        fetchSheet("LeaderBoards"),
        fetchSheet("Showdown History"),
        fetchSheet("Showdown")
      ]);`;
    content = content.substring(0, searchIndex) + oldPromise + content.substring(sEndIndex);
}

fs.writeFileSync('main.js', content, 'utf8');
console.log("Fixed promises accurately.");
