const fs = require('fs');
const main = fs.readFileSync('main.js', 'utf8');

const startStr = "  account: async () => {";
const endStr = "  users: async () => {";

const startIndex = main.indexOf(startStr);
const endIndex = main.indexOf(endStr);

console.log(main.substring(startIndex, endIndex));
