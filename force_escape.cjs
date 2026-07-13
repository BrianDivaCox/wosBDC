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

// Insert it right after the API_BASE_URL declaration
content = content.replace(
    'const API_BASE_URL = \'https://script.google.com/macros/s/AKfycbxXjDN5nXVsdojTudMtChy4ts6l4fckyKZGRTa7f689IiI8giejnzys4bnlIZaL28g/exec\';',
    'const API_BASE_URL = \'https://script.google.com/macros/s/AKfycbxXjDN5nXVsdojTudMtChy4ts6l4fckyKZGRTa7f689IiI8giejnzys4bnlIZaL28g/exec\';\n' + helper
);

fs.writeFileSync('main.js', content, 'utf8');
console.log("escapeHTML safely added");
