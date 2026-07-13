const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// Line 504: remove usersSnap
content = content.replace(
    'let usersSnap = null;\n        try { usersSnap = await get(ref(db, \'users\')); } catch(e) { console.warn("Could not fetch users:", e); }',
    'try { await get(ref(db, \'users\')); } catch(e) { console.warn("Could not fetch users:", e); }'
);

// Line 515: remove lbMap
content = content.replace('const lbMap = {};\n', '');

// Line 547: empty block
content = content.replace('if (t.includes(\'all-time showdown\')) {}', 'if (t.includes(\'all-time showdown\')) { /* noop */ }');

// Line 867: remove navLinks
content = content.replace('const navLinks = document.querySelectorAll(\'.nav-link\');\n', '');

// Line 943: error cause
content = content.replace('throw new Error("Database API is currently unavailable.");', 'throw new Error("Database API is currently unavailable.", { cause: e });');
content = content.replace('throw new Error("Invalid JSON response.");', 'throw new Error("Invalid JSON response.", { cause: e });');

// Line 982: devMode variables
content = content.replace('const devModeToggle = document.getElementById(\'devModeToggle\');\n', '');
content = content.replace('const devModeSlider = document.getElementById(\'devModeSlider\');\n', '');

// Catch blocks
content = content.replace(/catch \(err\) {/g, 'catch {');
content = content.replace(/catch\(e\) {/g, 'catch {');
content = content.replace(/catch \(e\) {}/g, 'catch { /* ignore */ }');

// Line 1262: unused uid
content = content.replace('for (const [uid, u] of Object.entries(users)) {', 'for (const [, u] of Object.entries(users)) {');

fs.writeFileSync('main.js', content, 'utf8');
console.log("Applied ESLint auto-fixes");
