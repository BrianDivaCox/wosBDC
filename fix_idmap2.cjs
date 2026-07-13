const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');
const oldBlock = `      const rosterMap = {};
      if (rosterRawData && rosterRawData.length > 0) {
        for (let i = 1; i < rosterRawData.length; i++) {
          let name = rosterRawData[i][0];
          if (name) {
            rosterMap[name.toString().trim()] = {
              giftCodes: rosterRawData[i][2], // Col C
              timeActive: rosterRawData[i][4] // Col E
            };
          }
        }
      }`;

const newBlock = `      const rosterMap = {};
      if (rosterRawData && rosterRawData.length > 0) {
        for (let i = 1; i < rosterRawData.length; i++) {
          let name = rosterRawData[i][0];
          let id = rosterRawData[i][1];
          if (name) {
            rosterMap[name.toString().trim()] = {
              giftCodes: rosterRawData[i][2], // Col C
              timeActive: rosterRawData[i][4] // Col E
            };
          }
          if (name && id) {
             idToNameMap[id] = name.toString().trim();
             nameToIdMap[name.toString().trim()] = id.toString().trim();
          }
        }
      }`;

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    console.log("Updated Roster View ID Map populator");
} else {
    console.log("Could not find Roster block");
}
fs.writeFileSync('main.js', content, 'utf8');
