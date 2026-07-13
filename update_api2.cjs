const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');
content = content.replace(
    /const API_BASE_URL = 'https:\/\/script\.google\.com\/macros\/s\/.*\/exec';/,
    'const API_BASE_URL = \'https://script.google.com/macros/s/AKfycby4LRewrJ84Ly-9F1Xi745u9VXSxUoMdvoPmjGcD1GLkphVqvxOig0-jLdrArOboX8/exec\';'
);
fs.writeFileSync('main.js', content, 'utf8');
console.log("Updated API_BASE_URL with deduplication version");
