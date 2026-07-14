const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = "1.15.35";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

let cl = fs.readFileSync('CHANGELOG.md', 'utf8');
const newLog = `## [1.15.35] - 2026-07-13
### Removed
- **Unused Themes**: Removed OLED, Mermaid, Forest, and Beta themes to streamline the settings menu. Only Light, Midnight, and Diva themes remain.

`;
cl = cl.replace("## [1.15.34]", newLog + "## [1.15.34]");
fs.writeFileSync('CHANGELOG.md', cl, 'utf8');
console.log("Bumped to 1.15.35");
