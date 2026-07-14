const fs = require('fs');

// package.json
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = "1.15.30";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

// CHANGELOG.md
let cl = fs.readFileSync('CHANGELOG.md', 'utf8');
const newLog = `## [1.15.30] - 2026-07-13
### Changed
- **Account Hub Polish**: Shrunk the overall padding, avatar size, and gap spacing inside the Player ID Card so it looks like a sleek, compact badge rather than an oversized bulky box.

`;
cl = cl.replace("## [1.15.29]", newLog + "## [1.15.29]");
fs.writeFileSync('CHANGELOG.md', cl, 'utf8');

console.log("Updated versions!");
