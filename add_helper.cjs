const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const mapHelper = `
export const refreshIdToNameMap = async () => {
    try {
        const [rosterRawData, giftcodebotData] = await Promise.all([
            fetchSheet("Chief's List").catch(() => null),
            fetchSheet("giftcodebot").catch(() => null)
        ]);
        
        if (rosterRawData && rosterRawData.length > 0) {
            for (let i = 1; i < rosterRawData.length; i++) {
                let name = rosterRawData[i][0];
                let id = rosterRawData[i][1];
                if (name && id) {
                    idToNameMap[id] = name.toString().trim();
                    nameToIdMap[name.toString().trim()] = id.toString().trim();
                }
            }
        }
        
        if (giftcodebotData && giftcodebotData.length > 1) {
            for (let i = 1; i < giftcodebotData.length; i++) {
                let name = giftcodebotData[i][1]; 
                let id = giftcodebotData[i][2]; 
                if (name && id) {
                    idToNameMap[id] = name.toString().trim();
                    nameToIdMap[name.toString().trim()] = id.toString().trim();
                }
            }
        }
    } catch(e) { console.error("Error refreshing ID map:", e); }
};
`;

// Insert the helper after `export let nameToIdMap = {};`
content = content.replace('export let nameToIdMap = {};', 'export let nameToIdMap = {};\n' + mapHelper);

fs.writeFileSync('main.js', content, 'utf8');
console.log("Added refreshIdToNameMap helper");
