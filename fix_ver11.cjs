const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = "1.15.38";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

let cl = fs.readFileSync('CHANGELOG.md', 'utf8');
const newLog = `## [1.15.38] - 2026-07-13
### Added
- **Real-Time Log Fetching**: Added a direct API bridge to bypass Firebase entirely for admin tools. The "Admin Log" in the Admin Hub and the "Today's Activity" widget on the homepage now feature a manual "Refresh" button that fetches the absolute freshest data directly from the Google Sheet.

`;
cl = cl.replace("## [1.15.37]", newLog + "## [1.15.37]");
fs.writeFileSync('CHANGELOG.md', cl, 'utf8');
console.log("Bumped to 1.15.38");
