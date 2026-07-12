const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8').replace(/\r\n/g, '\n');

const startStr = "if (btDonationsCurrent || btDonationsAllTime) {";
const endStr = "if (isAdmin) {";

let startIndex = content.indexOf(startStr);
let endIndex = content.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const newStr = `let btColIndex = -1;
    if (headers) {
        btColIndex = headers.findIndex(h => typeof h === 'string' && h.toLowerCase().trim() === 'total bt donations');
    }
    let hasFallbackCurrent = (btColIndex !== -1 && p && p[btColIndex] !== undefined && p[btColIndex] !== "");

    if (btDonationsCurrent || btDonationsAllTime || hasFallbackCurrent) {
         let allTimeStr = btDonationsAllTime ? '#' + btDonationsAllTime.rank + ' (' + btDonationsAllTime.score + ') All-Time' : '0 All-Time';
         let currentScoreStr = "0";
         if (btDonationsCurrent) {
             currentScoreStr = '#' + btDonationsCurrent.rank + ' (' + btDonationsCurrent.score + ')';
         } else if (hasFallbackCurrent) {
             currentScoreStr = '(' + p[btColIndex].toString() + ')';
         }
         let currentStr = currentScoreStr + ' Current';
         let innerText = allTimeStr + ' | ' + currentStr;
         headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🐻 BT Donations: <span style="color:var(--text-main);">'+innerText+'</span></span>';
      }
      
      `;
    content = content.substring(0, startIndex) + newStr + content.substring(endIndex);
    fs.writeFileSync('main.js', content, 'utf8');
    console.log("Successfully updated main.js using index logic");
} else {
    console.log("Not found! " + startIndex + " " + endIndex);
}
