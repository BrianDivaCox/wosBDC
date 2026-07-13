const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// Chunk 1
const chunk1 = `            window.showToast(\`🏆 Successfully crowned \${name} as Champion! (New Total: \${res.newTotal})\`, "success");\n            window.searchPlayerFull(name); // Refresh UI`;
const newChunk1 = `            window.showToast(\`🏆 Successfully crowned \${name} as Champion! (New Total: \${res.newTotal})\`, "success");\n            setTimeout(() => window.searchPlayerFull(name), 3000); // Refresh UI after Firebase sync`;
content = content.replace(chunk1, newChunk1);

// Chunk 2
const chunk2 = `    window.showToast("Updates complete!", "success", true);\n    window.sheetCache = {}; \n    if (document.getElementById('uniSearchInput')) {\n      window.searchPlayerFull(name); \n    } else {\n      views.roster();\n    }`;
const newChunk2 = `    window.showToast("Updates complete! Syncing...", "success", true);\n    window.sheetCache = {}; \n    setTimeout(() => {\n      if (document.getElementById('uniSearchInput')) {\n        window.searchPlayerFull(name); \n      } else {\n        views.roster();\n      }\n    }, 3000);`;
content = content.replace(chunk2, newChunk2);

// Chunk 3
const chunk3 = `      window.showToast("Successfully added! New Total: " + res.newTotal, "success", true);\n      window.sheetCache = {}; \n      if (document.getElementById('uniSearchInput')) {\n        window.searchPlayerFull(name);\n      } else {\n        views.roster();\n      }`;
const newChunk3 = `      window.showToast("Successfully added! New Total: " + res.newTotal, "success", true);\n      window.sheetCache = {}; \n      setTimeout(() => {\n        if (document.getElementById('uniSearchInput')) {\n          window.searchPlayerFull(name);\n        } else {\n          views.roster();\n        }\n      }, 3000);`;
content = content.replace(chunk3, newChunk3);

fs.writeFileSync('main.js', content, 'utf8');
console.log("Success!");
