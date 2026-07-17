const fs = require('fs');
let text = fs.readFileSync('main.js', 'utf8');

text = text.replace('window.showToast("User database refreshed!", "success", true)', 'window.showToast("User database refreshed!", "success")');
text = text.replace('window.showToast("You are already enrolled!", "success", true)', 'window.showToast("You are already enrolled!", "success")');
text = text.replace('window.showToast("Successfully Enrolled in Auto Redeem!", "success", true)', 'window.showToast("Successfully Enrolled in Auto Redeem!", "success")');
text = text.replaceAll('window.showToast("Schedule refreshed!", "success", true)', 'window.showToast("Schedule refreshed!", "success")');
text = text.replace('window.showToast("This Alt is already enrolled!", "success", true)', 'window.showToast("This Alt is already enrolled!", "success")');
text = text.replace('window.showToast("Successfully Enrolled Alt Account!", "success", true)', 'window.showToast("Successfully Enrolled Alt Account!", "success")');
text = text.replace('window.showToast("Successfully added! New Total: " + res.newTotal, "success", true)', 'window.showToast("Successfully added! New Total: " + res.newTotal, "success")');

fs.writeFileSync('main.js', text, 'utf8');
console.log('done');
