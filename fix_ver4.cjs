const fs = require('fs');

// package.json
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = "1.15.31";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

// CHANGELOG.md
let cl = fs.readFileSync('CHANGELOG.md', 'utf8');
const newLog = `## [1.15.31] - 2026-07-13
### Fixed
- **Account Hub Mobile Overflow**: Added missing \`box-sizing: border-box\` rule to the Player ID Card to prevent it from horizontally overflowing the screen boundaries on mobile devices. The card now perfectly respects the smartphone viewport boundaries just like the Upcoming Event widgets.

`;
cl = cl.replace("## [1.15.30]", newLog + "## [1.15.30]");
fs.writeFileSync('CHANGELOG.md', cl, 'utf8');

console.log("Updated versions!");
