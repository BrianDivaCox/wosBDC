const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// Fix bg-card typo just in case
css = css.replace('background: var(--bg-card);', 'background: var(--card-bg);');

// Add specific styles for each theme card
const newCss = `
.theme-card[data-theme="light"] {
  background: #ffffff;
  border-color: #e2e8f0;
}
.theme-card[data-theme="light"] .theme-label {
  color: #0f172a;
}

.theme-card[data-theme="midnight"] {
  background: #1e293b;
  border-color: #334155;
}
.theme-card[data-theme="midnight"] .theme-label {
  color: #f8fafc;
}

.theme-card[data-theme="ombre"] {
  background: #1a0b2e;
  border-color: #701a75;
}
.theme-card[data-theme="ombre"] .theme-label {
  color: #e9d5ff;
}
`;

css = css + newCss;
fs.writeFileSync('style.css', css, 'utf8');
console.log("Updated style.css");
