const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// 1. Export enrolledGameIds and populate it
content = content.replace(
    /export let idToNameMap = \{\};\s*export let nameToIdMap = \{\};/,
    `export let idToNameMap = {};
export let nameToIdMap = {};
export let enrolledGameIds = new Set();`
);

content = content.replace(
    /idToNameMap\[id\] = name\.toString\(\)\.trim\(\);\s*nameToIdMap\[name\.toString\(\)\.trim\(\)\] = id\.toString\(\)\.trim\(\);\s*\}/g,
    `idToNameMap[id] = name.toString().trim();
                      nameToIdMap[name.toString().trim()] = id.toString().trim();
                      enrolledGameIds.add(id.toString().trim());
                  }`
);

// 2. Update Alt Accounts in Account Hub
const oldAltBtnStr = `<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
        <button onclick="window.openAltPerksModal('\\$\{gid\}', '\\$\{altName.replace(/'/g, "\\\\'")\}')" style="background:var(--success); border:none; color:var(--text-main); cursor:pointer; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:4px;">&#x1F381; Enable Perks</button>
        <button onclick="window.unlinkAltAccountPrompt('\\$\{gid\}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:11px;">Unlink</button>
    </div>`;
    
const newAltBtnStr = `\${
        (enrolledGameIds.has(gid.toString())) 
        ? \`<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
            <div style="color:var(--success); font-weight:bold; font-size:11px; padding:4px 8px; border:1px solid var(--success); border-radius:4px; background:rgba(16,185,129,0.1);">&#x2705; Enrolled</div>
            <button onclick="window.unlinkAltAccountPrompt('\${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:11px;">Unlink</button>
           </div>\`
        : \`<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
            <button onclick="window.openAltPerksModal('\${gid}', '\${altName.replace(/'/g, "\\\\'")}')" style="background:var(--success); border:none; color:var(--text-main); cursor:pointer; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:4px;">&#x1F381; Enable Perks</button>
            <button onclick="window.unlinkAltAccountPrompt('\${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:11px;">Unlink</button>
           </div>\`
    }`;

content = content.replace(oldAltBtnStr, newAltBtnStr);

// 3. Update Main Account in Giftcodes view
const oldMainBtnStr = `const chiefName = currentUser.name || idToNameMap[currentUser.gameId] || "Unknown Chief";
          contentHtml = \`
            <div style="text-align:center; padding:40px 20px;">
              <div style="font-size:48px; margin-bottom:20px;">&#x1F381;</div>
              <h3 style="color:var(--text-main); margin-bottom:10px;">Enable Auto Redeem</h3>
              <p style="color:var(--text-muted); margin-bottom:25px; font-size:15px; line-height:1.5;">Welcome <strong>\${chiefName}</strong>! Click below to securely link your Game ID (\${currentUser.gameId}) to the Auto Redeem Bot. We will automatically fetch all new gift codes and inject them into your account!</p>
              <button id="optInPerksBtn" style="background:var(--success); color:var(--text-main); border:none; padding:14px 28px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px; transition:0.2s; box-shadow:0 4px 15px rgba(16,185,129,0.3);">1-Click Opt-In</button>
              <p style="margin-top:20px; font-size:13px; color:var(--text-muted);"><em>No double data entry needed. It's fully automated!</em></p>
            </div>
          \`;`;

const newMainBtnStr = `const chiefName = currentUser.name || idToNameMap[currentUser.gameId] || "Unknown Chief";
          if (enrolledGameIds.has(currentUser.gameId.toString())) {
              contentHtml = \`
                <div style="text-align:center; padding:40px 20px;">
                  <div style="font-size:48px; margin-bottom:20px;">&#x2705;</div>
                  <h3 style="color:var(--success); margin-bottom:10px;">Already Enrolled!</h3>
                  <p style="color:var(--text-muted); margin-bottom:25px; font-size:15px; line-height:1.5;">Your Game ID (<strong>\${currentUser.gameId}</strong>) is already actively monitored by the Auto Redeem Bot.</p>
                  <button disabled style="background:transparent; color:var(--success); border:1px solid var(--success); padding:14px 28px; border-radius:8px; font-weight:bold; font-size:16px;">Active &#x2705;</button>
                </div>
              \`;
          } else {
              contentHtml = \`
                <div style="text-align:center; padding:40px 20px;">
                  <div style="font-size:48px; margin-bottom:20px;">&#x1F381;</div>
                  <h3 style="color:var(--text-main); margin-bottom:10px;">Enable Auto Redeem</h3>
                  <p style="color:var(--text-muted); margin-bottom:25px; font-size:15px; line-height:1.5;">Welcome <strong>\${chiefName}</strong>! Click below to securely link your Game ID (\${currentUser.gameId}) to the Auto Redeem Bot. We will automatically fetch all new gift codes and inject them into your account!</p>
                  <button id="optInPerksBtn" style="background:var(--success); color:var(--text-main); border:none; padding:14px 28px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px; transition:0.2s; box-shadow:0 4px 15px rgba(16,185,129,0.3);">1-Click Opt-In</button>
                  <p style="margin-top:20px; font-size:13px; color:var(--text-muted);"><em>No double data entry needed. It's fully automated!</em></p>
                </div>
              \`;
          }`;

content = content.replace(oldMainBtnStr, newMainBtnStr);


fs.writeFileSync('main.js', content, 'utf8');
console.log("Updated main.js with automatic Enrolled detection");
