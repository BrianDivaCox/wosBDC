const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// 1. Admin player options
content = content.replace(
  '`<option value="${p}">${p}</option>`',
  '`<option value="${window.escapeHTML(p)}">${window.escapeHTML(p)}</option>`'
);

// 2. Roster datalist
content = content.replace(
  '`<option value="${rosterRawData[i][0]}">`',
  '`<option value="${window.escapeHTML(rosterRawData[i][0])}">`'
);

// 3. Leaderboards
content = content.replace(
  '${entry.name} ${entry.emoji || \'\'}</span>',
  '${window.escapeHTML(entry.name)} ${entry.emoji || \'\'}</span>'
);

// 4. Admin User Row (cName)
content = content.replace(
  '${cName} ${cName !== "Not Found" ? \'✅\' : \'❌\'}',
  '${window.escapeHTML(cName)} ${cName !== "Not Found" ? \'✅\' : \'❌\'}'
);

// 5. Alt names
content = content.replace(
  '${aName} ${aName !== "Not Found" ? \'✅\' : \'❌\'}',
  '${window.escapeHTML(aName)} ${aName !== "Not Found" ? \'✅\' : \'❌\'}'
);

fs.writeFileSync('main.js', content, 'utf8');
console.log("XSS protections applied");
