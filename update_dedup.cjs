const fs = require('fs');
let content = fs.readFileSync('..\\wos\\Sidebars_and_Tools.js', 'utf8');

const oldEndpoint = `
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
    } else if (apiEndpoint === 'getFormulas') {
`;

const newEndpoint = `
      } else if (apiEndpoint === 'registerNewPlayer') {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("giftcodebot");
        var name = e.parameter.name || "";
        var gameId = e.parameter.gameId || "";
        var dateStarted = e.parameter.dateStarted || "";
        
        if (sheet && name && gameId) {
          // Deduplication Check (Option A: Silent Skip)
          var data = sheet.getDataRange().getValues();
          var isDuplicate = false;
          // Loop through rows (skipping header) to check Column C (index 2) for gameId
          for (var i = 1; i < data.length; i++) {
              if (String(data[i][2]).trim() === String(gameId).trim()) {
                  isDuplicate = true;
                  break;
              }
          }
          
          if (!isDuplicate) {
              // Columns: Timestamp, Name, GameID, DateStarted
              sheet.appendRow([new Date(), name, gameId, dateStarted]);
              return ContentService.createTextOutput(JSON.stringify({success: true, status: 'added'}))
                .setMimeType(ContentService.MimeType.JSON);
          } else {
              // Option A: Silently skip without error
              return ContentService.createTextOutput(JSON.stringify({success: true, status: 'duplicate_skipped'}))
                .setMimeType(ContentService.MimeType.JSON);
          }
        }
    } else if (apiEndpoint === 'getFormulas') {
`;

// In case whitespace varies, replace carefully or use a regex
let updatedContent = content.replace(
  /} else if \(apiEndpoint === 'registerNewPlayer'\) {[\s\S]*?} else if \(apiEndpoint === 'getFormulas'\) {/,
  newEndpoint.trim()
);

if (updatedContent === content) {
    console.log("Failed to replace using regex. Please review.");
} else {
    fs.writeFileSync('..\\wos\\Sidebars_and_Tools.js', updatedContent, 'utf8');
    console.log("Updated GAS with deduplication logic");
}
