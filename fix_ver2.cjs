const fs = require('fs');

// package.json
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = "1.15.29";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

// CHANGELOG.md
let cl = fs.readFileSync('CHANGELOG.md', 'utf8');
const newLog = `## [1.15.29] - 2026-07-13
### Changed
- **Mobile Responsiveness**: Adjusted the new Player ID Card in the Account Hub to elegantly resize and wrap elements on small smartphones, preventing layout breakage or text clipping.

`;
cl = cl.replace("## [1.15.28]", newLog + "## [1.15.28]");
fs.writeFileSync('CHANGELOG.md', cl, 'utf8');

console.log("Updated versions!");
