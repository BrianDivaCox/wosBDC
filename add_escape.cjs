const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const helper = `
// --- Security Helpers ---
window.escapeHTML = (str) => {
  if (typeof str !== 'string') str = String(str || '');
  return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
  }[tag]));
};
`;

content = content.replace('// --- Firebase Setup ---', helper + '\n// --- Firebase Setup ---');
fs.writeFileSync('main.js', content, 'utf8');
console.log("escapeHTML added");
