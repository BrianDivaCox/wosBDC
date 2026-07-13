const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// Fix mangled emojis
content = content.replace(/dYZ\?/g, '&#x1F381;'); // Gift 🎁
content = content.replace(/dY"\?/g, '&#x1F381;'); // Gift 🎁
content = content.replace(/o-/g, '&#x1F512;');     // Lock 🔒

fs.writeFileSync('main.js', content, 'utf8');
console.log("Fixed emojis");
