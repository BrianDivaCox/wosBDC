const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');
let adminStart = content.indexOf('admin: async () => {');
if (adminStart !== -1) {
    console.log(content.substring(adminStart, adminStart + 6000));
}
