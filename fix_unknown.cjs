const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');
content = content.replace(/\|\| "Unknown"/g, '|| "Not Found"');
content = content.replace(/\|\| "Unknown Player"/g, '|| "Not Found"');
fs.writeFileSync('main.js', content, 'utf8');
