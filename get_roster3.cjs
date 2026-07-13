const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');
let rosterStart = content.indexOf('roster: async () => {');
let scheduleStart = content.indexOf('schedule: async () => {');
let rosterContent = content.substring(rosterStart, scheduleStart);
console.log(rosterContent.substring(rosterContent.indexOf('app.innerHTML =')));
