const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// 1. Remove window.linkAltAccountPrompt (since it's obsolete now)
const promptRegex = /window\.linkAltAccountPrompt = async \(\) => \{[\s\S]*?\};\s*/;
content = content.replace(promptRegex, '');

// 2. Rewrite the linkedHtml generation block
const oldLinkedHtmlRegex = /let linkedHtml = '';\s*let links = currentUser\.linkedGameIds \|\| \[\];\s*if \(links\.length > 0\) \{[\s\S]*?\} else \{[\s\S]*?\}\s*let currentChiefName = /;

const newLinkedHtml = `let linkedHtml = '';
      let links = currentUser.linkedGameIds || [];
      
      linkedHtml += \`<div style="text-align:left; border-top:1px solid var(--border); padding-top:20px; margin-top:20px;">
        <h3 style="margin-top:0; color:var(--text-main); font-size:16px;">s< Linked Alt Accounts</h3>\`;
        
      if (links.length > 0) {
          linkedHtml += \`<div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px;">\`;
          links.forEach(gid => {
              let altName = idToNameMap[gid] || \`Game ID: \${gid}\`;
              linkedHtml += \`<div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-main); padding:10px 15px; border-radius:8px; border:1px solid var(--border);">
                  <div style="display:flex; align-items:center; gap:10px;">
                      <div style="width:30px; height:30px; border-radius:50%; background:var(--accent); color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; overflow:hidden;">
                          <img src="\${avatarMap[gid] || \`images/\${altName}.png\`}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
                          <div style="display:none; align-items:center; justify-content:center; width:100%; height:100%;">\${altName.charAt(0).toUpperCase()}</div>
                      </div>
                      <div style="text-align:left;">
                          <div style="font-weight:bold; font-size:14px; color:var(--text-main);">\${altName}</div>
                          <div style="font-size:11px; color:var(--text-muted);">\${gid}</div>
                      </div>
                  </div>
                  <button onclick="window.unlinkAltAccountPrompt('\${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:12px;">Unlink</button>
              </div>\`;
          });
          linkedHtml += \`</div>\`;
      } else {
          linkedHtml += \`<p style="color:var(--text-muted); font-size:13px; margin-bottom:15px;">You can link up to 2 alt accounts to bypass the unregistered filter.</p>\`;
      }
      
      if (links.length < 2) {
          linkedHtml += \`
          <div id="linkAltForm" style="display:none; background:var(--card-bg); padding:15px; border-radius:8px; border:1px solid var(--border); margin-bottom:15px;">
              <input type="number" id="altGameIdInput" placeholder="Enter Alt Game ID" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); margin-bottom:10px;">
              <div id="altChiefConfirm" style="font-size:13px; margin-bottom:10px; display:none;"></div>
              <div style="display:flex; gap:10px;">
                  <button id="cancelAltBtn" style="flex:1; background:transparent; border:1px solid var(--border); color:var(--text-muted); padding:8px; border-radius:6px; cursor:pointer;">Cancel</button>
                  <button id="submitAltBtn" style="flex:1; background:var(--accent); color:#fff; border:none; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold;">Confirm Link</button>
              </div>
          </div>
          <button id="openLinkAltBtn" style="background:rgba(52,152,219,0.1); color:var(--accent); border:1px dashed var(--accent); padding:10px; border-radius:8px; cursor:pointer; font-weight:bold; width:100%; transition:0.2s;" onmouseover="this.style.background='rgba(52,152,219,0.2)'" onmouseout="this.style.background='rgba(52,152,219,0.1)'">+ Link \${links.length > 0 ? 'Another' : 'Alt'} Account</button>\`;
      }
      linkedHtml += \`</div>\`;
      
      let currentChiefName = `;

if (content.match(oldLinkedHtmlRegex)) {
    content = content.replace(oldLinkedHtmlRegex, newLinkedHtml);
} else {
    console.log("oldLinkedHtmlRegex missed!");
}

// 3. Inject event listeners immediately after app.innerHTML = `...`;
const endOfInnerHTML = `        // Basic size check (optional but good practice to prevent massive uploads crashing browser)
        if (file.size > 10 * 1024 * 1024) { // 10MB`;

const newListeners = `      const openLinkAltBtn = document.getElementById('openLinkAltBtn');
      const linkAltForm = document.getElementById('linkAltForm');
      const altGameIdInput = document.getElementById('altGameIdInput');
      const altChiefConfirm = document.getElementById('altChiefConfirm');
      const cancelAltBtn = document.getElementById('cancelAltBtn');
      const submitAltBtn = document.getElementById('submitAltBtn');
      
      if (openLinkAltBtn) {
          openLinkAltBtn.addEventListener('click', () => {
              openLinkAltBtn.style.display = 'none';
              linkAltForm.style.display = 'block';
              altGameIdInput.value = '';
              altChiefConfirm.style.display = 'none';
          });
          
          cancelAltBtn.addEventListener('click', () => {
              openLinkAltBtn.style.display = 'block';
              linkAltForm.style.display = 'none';
          });
          
          altGameIdInput.addEventListener('input', () => {
              const val = altGameIdInput.value.trim();
              if (!val) {
                  altChiefConfirm.style.display = 'none';
                  return;
              }
              altChiefConfirm.style.display = 'block';
              if (idToNameMap[val]) {
                  altChiefConfirm.innerHTML = \`Is your Chief Name: <strong style="color:var(--success)">\${idToNameMap[val]}</strong>?\`;
              } else {
                  altChiefConfirm.innerHTML = \`<span style="color:var(--danger)">Game ID not found in master database.</span>\`;
              }
          });
          
          submitAltBtn.addEventListener('click', async () => {
              const val = altGameIdInput.value.trim();
              if (!val) return;
              try {
                  submitAltBtn.textContent = "Linking...";
                  submitAltBtn.disabled = true;
                  await linkAltAccount(currentUser.uid, val, currentUser.linkedGameIds || []);
                  if(window.showToast) window.showToast("Alt account linked!", "success");
              } catch(e) {
                  if(window.showToast) window.showToast(e.message, "error");
                  else alert(e.message);
                  submitAltBtn.textContent = "Confirm Link";
                  submitAltBtn.disabled = false;
              }
          });
      }
      
        // Basic size check (optional but good practice to prevent massive uploads crashing browser)
        if (file.size > 10 * 1024 * 1024) { // 10MB`;

if (content.includes(endOfInnerHTML)) {
    content = content.replace(endOfInnerHTML, newListeners);
} else {
    console.log("endOfInnerHTML missed!");
}

fs.writeFileSync('main.js', content, 'utf8');
console.log("Done.");
