const fs = require('fs');

// package.json
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = "1.15.33";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

// CHANGELOG.md
let cl = fs.readFileSync('CHANGELOG.md', 'utf8');
const newLog = `## [1.15.33] - 2026-07-13
### Fixed
- **All-Time BT Donations Fallback**: Fixed an issue where players who were not in the Top 4 All-Time Bear Donations leaderboard showed as having 0 All-Time donations. A new Google Apps Script was deployed to inject an automatic summing formula into the Google Sheet to calculate the true All-Time total from Activity History, and the frontend logic was updated to use this new column as a fallback.

`;
cl = cl.replace("## [1.15.32]", newLog + "## [1.15.32]");
fs.writeFileSync('CHANGELOG.md', cl, 'utf8');

console.log("Updated versions!");
