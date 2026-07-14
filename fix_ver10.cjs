const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = "1.15.37";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

let cl = fs.readFileSync('CHANGELOG.md', 'utf8');
const newLog = `## [1.15.37] - 2026-07-13
### Fixed
- **API Endpoint Quota Limits**: Fixed an issue where the website's Admin Hub was throwing "Service invoked too many times" errors when editing player activity. The backend API endpoints were updated to use the new Batched Sync queue instead of instantaneous pushes, bypassing the daily API quota completely.

`;
cl = cl.replace("## [1.15.36]", newLog + "## [1.15.36]");
fs.writeFileSync('CHANGELOG.md', cl, 'utf8');
console.log("Bumped to 1.15.37");
