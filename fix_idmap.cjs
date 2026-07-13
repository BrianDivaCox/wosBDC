const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const oldBlock = `      if (rosterRawData && rosterRawData.length > 0) {
        for (let i = 1; i < rosterRawData.length; i++) {
          if (rosterRawData[i][0] && rosterRawData[i][0].toString().trim() !== "") {
            players.push(rosterRawData[i][0].toString().trim());
          }
        }
      }`;

const newBlock = `      if (rosterRawData && rosterRawData.length > 0) {
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

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    console.log("Updated Admin View ID Map populator");
} else {
    console.log("Could not find block");
}
fs.writeFileSync('main.js', content, 'utf8');
