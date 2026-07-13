const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');
content = content.replace(
    /const API_BASE_URL = 'https:\/\/script\.google\.com\/macros\/s\/.*\/exec';/,
    'const API_BASE_URL = \'https://script.google.com/macros/s/AKfycbwvls2_2lrYjb51waqZkDIXW0Ra8mBq-W6RxA-kcaYwQQrKPs6IbJA_Z1IEl7TYA-g/exec\';'
);
fs.writeFileSync('main.js', content, 'utf8');
console.log("Updated API_BASE_URL");
