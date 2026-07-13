const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');
let adminStart = content.indexOf('admin: async () => {');
if (adminStart !== -1) {
    let sub = content.substring(adminStart, adminStart + 15000);
    // Print the admin users tab logic
    let tabUsersStart = sub.indexOf('<!-- Tab 2: Users -->');
    if (tabUsersStart !== -1) {
        console.log(sub.substring(tabUsersStart, tabUsersStart + 4000));
    } else {
        console.log("Could not find Tab 2: Users");
    }
}
