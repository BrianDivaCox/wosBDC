const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const oldGlobalBlock = `  // Immediately fetch mapping data to ensure auth UI is populated
  fetchSheet("Chief's List").then(rosterRawData => {
    if (rosterRawData && rosterRawData.length > 0) {
      for (let i = 1; i < rosterRawData.length; i++) {
        let name = rosterRawData[i][0];
        let id = rosterRawData[i][1];
        if (name && id) {
           idToNameMap[id] = name.toString().trim();
           nameToIdMap[name.toString().trim()] = id.toString().trim();
        }
      }
      // Update navbar if user already loaded
      if (currentUser && authSidebarBtn) {
         authSidebarBtn.innerHTML = \`👤  \${idToNameMap[currentUser.gameId] || 'Account'}\`;
      }
      // Update Account Hub if it is currently open
      const accHubView = document.getElementById('accountHubView');
      if (accHubView && currentUser) {
         views.account(); // re-render account view with correct name
      }
    }
  }).catch(console.error);`;

const newGlobalBlock = `  // Immediately fetch mapping data to ensure auth UI is populated
  refreshIdToNameMap().then(() => {
      // Update navbar if user already loaded
      if (currentUser && authSidebarBtn) {
         authSidebarBtn.innerHTML = \`👤  \${idToNameMap[currentUser.gameId] || 'Account'}\`;
      }
      // Update Account Hub if it is currently open
      const accHubView = document.getElementById('accountHubView');
      if (accHubView && currentUser) {
         views.account(); // re-render account view with correct name
      }
  }).catch(console.error);`;

content = content.replace(oldGlobalBlock, newGlobalBlock);
fs.writeFileSync('main.js', content, 'utf8');
console.log("Updated global block");
