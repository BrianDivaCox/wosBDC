const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// 1. nameToIdMap population inside window.searchPlayerFull (if any)
const mapRegex = /(nameToIdMap\[name\.toString\(\)\.trim\(\)\] = )(id);/g;
content = content.replace(mapRegex, "$1id.toString().trim();");

// 2. nameToIdMap population inside views.roster
const rosterMapRegex = /(nameToIdMap\[name\.toString\(\)\.trim\(\)\] = )(id);/g;
content = content.replace(rosterMapRegex, "$1id.toString().trim();");

// 3. registeredGameIds string casting
const setRegex = /(if \(u\.gameId\) registeredGameIds\.add\()(u\.gameId)(\);)/g;
content = content.replace(setRegex, "$1u.gameId.toString().trim()$3");

// 4. In roster view: cast gid to string during has() check
const checkRegex = /(if \(gid && registeredGameIds\.has\()(gid)(\)\) isReg = true;)/g;
content = content.replace(checkRegex, "$1gid.toString().trim()$3");

fs.writeFileSync('main.js', content, 'utf8');
console.log("Successfully casted gameIds via Regex!");
