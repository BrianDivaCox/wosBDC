const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = "1.15.36";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

let cl = fs.readFileSync('CHANGELOG.md', 'utf8');
const newLog = `## [1.15.36] - 2026-07-13
### Fixed
- **Theme Menu Readability**: Fixed an issue where the text on the theme selection cards became unreadable depending on the currently active global theme. Each theme card now has a permanent, hardcoded background and text color that acts as a mini-preview of the theme it represents.

`;
cl = cl.replace("## [1.15.35]", newLog + "## [1.15.35]");
fs.writeFileSync('CHANGELOG.md', cl, 'utf8');
console.log("Bumped to 1.15.36");
