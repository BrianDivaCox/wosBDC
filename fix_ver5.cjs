const fs = require('fs');

// package.json
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = "1.15.32";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

// CHANGELOG.md
let cl = fs.readFileSync('CHANGELOG.md', 'utf8');
const newLog = `## [1.15.32] - 2026-07-13
### Fixed
- **BT Donations Parsing**: Fixed an issue where the All-Time Bear Trap Donations rank/score showed up as 0. The leaderboard parser was strictly looking for the phrase "bear donations", but the tab in the spreadsheet is named "Bear Trap Donations" (or "BT Donations"), causing the text-match to fail. It now intelligently matches any variation of Bear Trap/BT Donations.

`;
cl = cl.replace("## [1.15.31]", newLog + "## [1.15.31]");
fs.writeFileSync('CHANGELOG.md', cl, 'utf8');

console.log("Updated versions!");
