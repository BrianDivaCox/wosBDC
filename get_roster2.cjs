const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');
let idx = content.indexOf('roster: async () => {');
if (idx !== -1) {
    let sub = content.substring(idx, idx + 15000);
    // Print the bottom 4000 characters of the function
    let endIdx = sub.indexOf('views.schedule =');
    if (endIdx === -1) endIdx = sub.length;
    console.log(sub.substring(endIdx - 3000, endIdx));
}
