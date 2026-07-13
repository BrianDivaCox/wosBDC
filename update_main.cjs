const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// Add element references
content = content.replace(
    'const authGameId = document.getElementById(\'authGameId\');',
    'const authGameId = document.getElementById(\'authGameId\');\nconst authChiefName = document.getElementById(\'authChiefName\');\nconst authDateStarted = document.getElementById(\'authDateStarted\');'
);

// Toggle logic
content = content.replace(
    'authGameId.style.display = \'block\';',
    'authGameId.style.display = \'block\';\n    if(authChiefName) authChiefName.style.display = \'block\';\n    if(authDateStarted) authDateStarted.style.display = \'block\';'
);
content = content.replace(
    'authGameId.style.display = \'none\';',
    'authGameId.style.display = \'none\';\n    if(authChiefName) authChiefName.style.display = \'none\';\n    if(authDateStarted) authDateStarted.style.display = \'none\';'
);

// Submit logic
content = content.replace(
    'const gameId = authGameId.value.trim();',
    'const gameId = authGameId.value.trim();\n  const chiefName = authChiefName ? authChiefName.value.trim() : "";\n  const dateStarted = authDateStarted ? authDateStarted.value : "";'
);

content = content.replace(
    '      if (!gameId) throw new Error(\'Game ID is required.\');',
    '      if (!gameId) throw new Error(\'Game ID is required.\');\n      if (!chiefName) throw new Error(\'Chief Name is required.\');'
);

const fetchCode = `
      await registerUser(email, password, gameId, chiefName);
      
      // Auto-post to giftcodebot Google Sheet via backend API
      try {
          const url = \`\${API_BASE_URL}?api=registerNewPlayer&gameId=\${encodeURIComponent(gameId)}&name=\${encodeURIComponent(chiefName)}&dateStarted=\${encodeURIComponent(dateStarted)}\`;
          fetch(url).catch(e => console.warn("Failed to ping GAS for registration", e));
      } catch(e) {}
`;

content = content.replace(
    'await registerUser(email, password, gameId);',
    fetchCode
);

fs.writeFileSync('main.js', content, 'utf8');
console.log("Updated main.js logic");
