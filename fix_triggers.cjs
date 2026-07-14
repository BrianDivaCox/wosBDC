const fs = require('fs');
let content = fs.readFileSync('../wos/Triggers.js', 'utf8');

const t1 = `    // Automatically sync changes to Firebase\n    pushSheetToFirebase(sheetName);`;
const r1 = `    // Automatically sync changes to Firebase\n    pushSheetToFirebase(sheetName);\n    var trackedEvents = ["Polar Terrors", "Alliance Championship ", "Mercenary Prestige", "Voter", "Showdown", "Bear Trap Donations"];\n    if (trackedEvents.includes(sheetName)) {\n        SpreadsheetApp.flush();\n        pushSheetToFirebase("activity ");\n    }`;
content = content.replace(t1, r1);

fs.writeFileSync('../wos/Triggers.js', content, 'utf8');
console.log("Success!");
