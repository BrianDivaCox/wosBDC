const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = "1.15.34";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

let cl = fs.readFileSync('CHANGELOG.md', 'utf8');
const newLog = `## [1.15.34] - 2026-07-13
### Changed
- **UI Tweaks**: Changed the Account Hub nav button text to "[Chief Name]'s Profile" instead of just the chief's name, making it clearer that the button is a clickable menu for accessing the Account Hub.

`;
cl = cl.replace("## [1.15.33]", newLog + "## [1.15.33]");
fs.writeFileSync('CHANGELOG.md', cl, 'utf8');
console.log("Bumped to 1.15.34");
