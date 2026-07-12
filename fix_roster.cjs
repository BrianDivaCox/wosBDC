const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Fix views.roster
const rosterPromiseTarget = `    roster: async () => {
      renderLoading("Loading Player Lookup");
      try {
        const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData] = await Promise.all([
          fetchSheet("activity "),
          fetchSheet("Chief's List"),
          fetchSheet("LeaderBoards"),
          fetchSheet("Showdown History"),
          fetchSheet("Showdown")
        ]);`;

const rosterPromiseNew = `    roster: async () => {
      renderLoading("Loading Player Lookup");
      try {
        const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData, usersSnap] = await Promise.all([
          fetchSheet("activity "),
          fetchSheet("Chief's List"),
          fetchSheet("LeaderBoards"),
          fetchSheet("Showdown History"),
          fetchSheet("Showdown"),
          get(ref(db, 'users'))
        ]);`;

content = content.replace(rosterPromiseTarget, rosterPromiseNew);

// 2. Fix window.searchPlayerFull
const searchPromiseTarget = `    try {
      const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData, usersSnap] = await Promise.all([
          fetchSheet("activity "),
          fetchSheet("Chief's List"),
          fetchSheet("LeaderBoards"),
          fetchSheet("Showdown History"),
          fetchSheet("Showdown"),
          get(ref(db, 'users'))
        ]);`;

const searchPromiseNew = `    try {
      const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData] = await Promise.all([
        fetchSheet("activity "),
        fetchSheet("Chief's List"),
        fetchSheet("LeaderBoards"),
        fetchSheet("Showdown History"),
        fetchSheet("Showdown")
      ]);`;

content = content.replace(searchPromiseTarget, searchPromiseNew);

fs.writeFileSync('main.js', content, 'utf8');
console.log("Fixed promises.");
