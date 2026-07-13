const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const oldAdminBlock = `        const players = [];
        if (rosterRawData && rosterRawData.length > 0) {
          for (let i = 1; i < rosterRawData.length; i++) {
            let name = rosterRawData[i][0];
            let id = rosterRawData[i][1];
            
            if (name && name.toString().trim() !== "") {
              players.push(name.toString().trim());
            }
            
            if (name && id) {
               idToNameMap[id] = name.toString().trim();
               nameToIdMap[name.toString().trim()] = id.toString().trim();
            }
          }
        }`;

const newAdminBlock = `        const players = [];
        if (rosterRawData && rosterRawData.length > 0) {
          for (let i = 1; i < rosterRawData.length; i++) {
            let name = rosterRawData[i][0];
            if (name && name.toString().trim() !== "") {
              players.push(name.toString().trim());
            }
          }
        }
        await refreshIdToNameMap();`;

content = content.replace(oldAdminBlock, newAdminBlock);
fs.writeFileSync('main.js', content, 'utf8');
console.log("Updated admin block");
