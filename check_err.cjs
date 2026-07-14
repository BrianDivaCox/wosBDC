const fs = require('fs');
let main = fs.readFileSync('main.js', 'utf8');
const lines = main.split('\n');
for (let i = 90; i < 110; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
