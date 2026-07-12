const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');
let idx = content.indexOf('${linkedHtml}');
if (idx !== -1) {
    console.log("FOUND!");
    console.log(content.substring(idx - 50, idx + 50));
} else {
    console.log("NOT FOUND!");
}
