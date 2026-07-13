const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');
let idx = content.indexOf('roster: async () => {');
if (idx !== -1) {
    let sub = content.substring(idx, idx + 10000);
    // Find where the roster cards are rendered
    let renderIdx = sub.indexOf('playerListHtml +=');
    console.log(sub.substring(renderIdx - 500, renderIdx + 1500));
}
