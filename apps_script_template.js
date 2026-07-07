const FIREBASE_URL = "https://wos-dashboard-38d4c-default-rtdb.firebaseio.com";
const FIREBASE_SECRET = "YOUR_DATABASE_SECRET"; // We will paste this here later!

// Pushes a single sheet to Firebase Realtime Database
function pushSheetToFirebase(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return;
  
  const data = sheet.getDataRange().getValues();
  const url = `${FIREBASE_URL}/sheets/${encodeURIComponent(sheetName)}.json?auth=${FIREBASE_SECRET}`;
  
  const options = {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(data),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}

// Automatically push to Firebase whenever YOU manually edit the spreadsheet
function onEdit(e) {
  if (!e) return;
  const sheetName = e.source.getActiveSheet().getName();
  pushSheetToFirebase(sheetName);
}
