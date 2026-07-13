const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');
let adminStart = content.indexOf('admin: async () => {');
if (adminStart !== -1) {
    let sub = content.substring(adminStart, adminStart + 10000);
    // Print the admin view logic
    let endIdx = sub.indexOf('},');
    if (endIdx !== -1) {
       console.log(sub.substring(0, endIdx));
    }
}
