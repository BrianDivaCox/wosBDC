const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Update Promise.all
let promiseStartStr = `const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData] = await Promise.all([`;
let promiseEndStr = `]);`;

let pStartIndex = content.indexOf(promiseStartStr);
if (pStartIndex !== -1) {
    let pEndIndex = content.indexOf(promiseEndStr, pStartIndex) + promiseEndStr.length;
    let newPromise = `const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData, usersSnap] = await Promise.all([
          fetchSheet("activity "),
          fetchSheet("Chief's List"),
          fetchSheet("LeaderBoards"),
          fetchSheet("Showdown History"),
          fetchSheet("Showdown"),
          get(ref(db, 'users'))
        ]);`;
    content = content.substring(0, pStartIndex) + newPromise + content.substring(pEndIndex);
}

// 2. Update HTML and sorting logic
let htmlStartStr = `// Sort players alphabetically for the dropdown`;
let htmlEndStr = `const container = document.getElementById('playerProfileContainer');`;

let hStartIndex = content.indexOf(htmlStartStr);
if (hStartIndex !== -1) {
    let hEndIndex = content.indexOf(htmlEndStr, hStartIndex) + htmlEndStr.length;
    let newHtml = `// Sort players alphabetically for the dropdown
        players.sort((a, b) => a[0].toString().localeCompare(b[0].toString()));
        
        const registeredGameIds = new Set();
        if (usersSnap && usersSnap.val()) {
            Object.values(usersSnap.val()).forEach(u => {
                if (u.gameId) registeredGameIds.add(u.gameId);
            });
        }
        
        let html = \`<div class="card" style="margin-bottom:20px; text-align:center;">
                      <div class="card-title" style="margin-bottom:15px; font-size:24px;">🕵️‍♂️ Player Lookup</div>
                      
                      <div style="margin-bottom:15px; font-size:14px; color:var(--text-muted);">
                          <label style="cursor:pointer; display:inline-flex; align-items:center; gap:8px; justify-content:center;">
                              <input type="checkbox" id="registeredOnlyToggle"> 
                              Show Registered Accounts Only
                          </label>
                      </div>

                      <select id="playerLookupSelect" style="width:100%; max-width:400px; padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); font-size:16px; font-weight:bold; cursor:pointer;">
                        <!-- Options rendered via JS -->
                      </select>
                    </div>
                    
                    <div id="playerProfileContainer">
                      <div style="text-align:center; color:var(--text-muted); padding:40px; font-size:16px;">
                        Select a player to view their activity profile.
                      </div>
                    </div>\`;
                    
        app.innerHTML = html;
        
        const select = document.getElementById('playerLookupSelect');
        const container = document.getElementById('playerProfileContainer');
        const regToggle = document.getElementById('registeredOnlyToggle');
        
        const renderDropdownOptions = () => {
            const onlyReg = regToggle.checked;
            let optsHtml = '<option value="">-- Select a Chief --</option>';
            players.forEach((p, i) => {
                let name = p[0].toString().trim();
                let isReg = false;
                let gid = nameToIdMap[name];
                if (gid && registeredGameIds.has(gid)) isReg = true;
                
                if (onlyReg && !isReg) return;
                
                let nt = /^[\x20-\x7E]*$/.test(name) ? 'class="notranslate"' : '';
                optsHtml += \`<option value="\${i}" \${nt}>\${name}\${isReg ? ' (✅)' : ''}</option>\`;
            });
            select.innerHTML = optsHtml;
        };
        
        renderDropdownOptions();
        
        regToggle.addEventListener('change', () => {
            renderDropdownOptions();
            select.value = "";
            renderCardForChief(""); // Clear profile
        });`;
    content = content.substring(0, hStartIndex) + newHtml + content.substring(hEndIndex);
}

fs.writeFileSync('main.js', content, 'utf8');
console.log("Success! Replaced: Promise=" + (pStartIndex!==-1) + " Html=" + (hStartIndex!==-1));
