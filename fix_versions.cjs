const fs = require('fs');

// package.json
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = "1.15.28";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

// CHANGELOG.md
let cl = fs.readFileSync('CHANGELOG.md', 'utf8');
const newLog = `## [1.15.28] - 2026-07-13
### Changed
- **Account Hub Redesign**: Transformed the Account Hub into a premium "Player ID Card". It now displays the player's Avatar, Game ID, Joined Date, Time Active tag, and Giftcode Bot link status in a sleek, glassmorphic layout.

## [1.15.27] - 2026-07-13
### Fixed
- **Backend Firebase Sync**: Fixed a core backend issue where Google Apps Script was correctly updating event sheets but failing to push the recalculated \`activity\` master sheet to Firebase. The website Player Cards will now correctly show the updated statuses without relying on the daily 1 AM scheduled sync.

`;
cl = cl.replace("## [1.15.26]", newLog + "## [1.15.26]");
fs.writeFileSync('CHANGELOG.md', cl, 'utf8');

console.log("Updated versions!");
