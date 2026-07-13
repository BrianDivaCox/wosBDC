const fs = require('fs');
let content = fs.readFileSync('..\\wos\\Sidebars_and_Tools.js', 'utf8');

const newEndpoint = `
      } else if (apiEndpoint === 'registerNewPlayer') {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("giftcodebot");
        var name = e.parameter.name || "";
        var gameId = e.parameter.gameId || "";
        var dateStarted = e.parameter.dateStarted || "";
        
        if (sheet && name && gameId) {
          // Columns: Timestamp, Name, GameID, DateStarted
          sheet.appendRow([new Date(), name, gameId, dateStarted]);
          return ContentService.createTextOutput(JSON.stringify({success: true}))
            .setMimeType(ContentService.MimeType.JSON);
        }
`;

content = content.replace(
    '} else if (apiEndpoint === \'getFormulas\') {',
    newEndpoint.trim() + '\n    } else if (apiEndpoint === \'getFormulas\') {'
);

fs.writeFileSync('..\\wos\\Sidebars_and_Tools.js', content, 'utf8');
console.log("Updated GAS with registerNewPlayer");
