const fs = require('fs');

// Sidebars_and_Tools.js
let content = fs.readFileSync('../wos/Sidebars_and_Tools.js', 'utf8');

const t1 = `pushSheetToFirebase("WhiteOut Survival"); // Sync the activity sheet`;
const r1 = `pushSheetToFirebase("WhiteOut Survival");\n            pushSheetToFirebase("activity ");`;
content = content.replace(t1, r1);

const t2 = `pushSheetToFirebase("WhiteOut Survival");\n        if (ptUpdated) pushSheetToFirebase("Polar Terrors");`;
const r2 = `pushSheetToFirebase("WhiteOut Survival");\n        pushSheetToFirebase("activity ");\n        if (ptUpdated) pushSheetToFirebase("Polar Terrors");`;
content = content.replace(t2, r2);

const t3 = `pushSheetToFirebase(eventSheetName); // Sync event sheet to Firebase\n            pushSheetToFirebase("WhiteOut Survival"); // Sync the master tracking sheet\n            pushSheetToFirebase("Admin Log");`;
const r3 = `pushSheetToFirebase(eventSheetName); // Sync event sheet to Firebase\n            pushSheetToFirebase("WhiteOut Survival"); // Sync the master tracking sheet\n            pushSheetToFirebase("activity "); // Sync the frontend master sheet\n            pushSheetToFirebase("Admin Log");`;
content = content.replace(t3, r3);

fs.writeFileSync('../wos/Sidebars_and_Tools.js', content, 'utf8');

// Triggers.js
let triggers = fs.readFileSync('../wos/Triggers.js', 'utf8');
const t4 = `pushSheetToFirebase("WhiteOut Survival");\n  pushSheetToFirebase("News");`;
const r4 = `pushSheetToFirebase("WhiteOut Survival");\n  pushSheetToFirebase("activity ");\n  pushSheetToFirebase("News");`;
triggers = triggers.replace(t4, r4);
fs.writeFileSync('../wos/Triggers.js', triggers, 'utf8');

console.log("Success!");
