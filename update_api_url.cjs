const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

content = content.replace(
    /const API_BASE_URL = "https:\/\/script\.google\.com\/macros\/s\/.*\/exec";/,
    `const API_BASE_URL = "https://script.google.com/macros/s/AKfycbxo0wAIbz--dZLapt9mjpYBeJZZhigXmjrGq-FlRTDdJkHCL_AyrF-Ije0MBgWufEA/exec";`
);

fs.writeFileSync('main.js', content, 'utf8');
console.log("Updated API_BASE_URL in main.js");
