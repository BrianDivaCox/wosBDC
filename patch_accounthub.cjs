const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// 1. Add window functions near the top (e.g. after window.isAdminUser)
const adminUserTarget = `window.isAdminUser = (user) => {`;
const windowFuncs = `window.linkAltAccountPrompt = async () => {
    let numLinks = (currentUser.linkedGameIds || []).length;
    if (numLinks >= 2) {
        if(window.showToast) window.showToast("Maximum of 2 alt accounts allowed.", "error");
        else alert("Maximum of 2 alt accounts allowed.");
        return;
    }
    let gid = prompt("Enter the exact Game ID of your Alt Account:");
    if (!gid) return;
    try {
        await linkAltAccount(currentUser.uid, gid.trim(), currentUser.linkedGameIds || []);
        if(window.showToast) window.showToast("Alt account linked!", "success");
    } catch(e) {
        if(window.showToast) window.showToast(e.message, "error");
        else alert(e.message);
    }
};

window.unlinkAltAccountPrompt = async (gid) => {
    if (!confirm(\`Are you sure you want to unlink Game ID \${gid}?\`)) return;
    try {
        await unlinkAltAccount(currentUser.uid, gid.toString().trim(), currentUser.linkedGameIds || []);
        if(window.showToast) window.showToast("Account unlinked.", "success");
    } catch(e) {
        if(window.showToast) window.showToast(e.message, "error");
        else alert(e.message);
    }
};

`;

if (!content.includes('window.linkAltAccountPrompt')) {
    content = content.replace(adminUserTarget, windowFuncs + adminUserTarget);
}

// 2. Inject HTML generation inside views.account
const htmlGenTarget = `      app.innerHTML = \``;
const htmlGenInject = `      let linkedHtml = '';
      let links = currentUser.linkedGameIds || [];
      if (links.length > 0) {
          linkedHtml += \`<div style="text-align:left; border-top:1px solid var(--border); padding-top:20px; margin-top:20px;">
            <h3 style="margin-top:0; color:var(--text-main); font-size:16px;">s< Linked Alt Accounts</h3>
            <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px;">\`;
            
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
          if (links.length < 2) {
              linkedHtml += \`<button onclick="window.linkAltAccountPrompt()" style="background:rgba(52,152,219,0.1); color:var(--accent); border:1px dashed var(--accent); padding:10px; border-radius:8px; cursor:pointer; font-weight:bold; width:100%; transition:0.2s;" onmouseover="this.style.background='rgba(52,152,219,0.2)'" onmouseout="this.style.background='rgba(52,152,219,0.1)'">+ Link Another Account</button>\`;
          }
          linkedHtml += \`</div>\`;
      } else {
          linkedHtml += \`<div style="text-align:left; border-top:1px solid var(--border); padding-top:20px; margin-top:20px;">
            <h3 style="margin-top:0; color:var(--text-main); font-size:16px;">s< Linked Alt Accounts</h3>
            <p style="color:var(--text-muted); font-size:13px; margin-bottom:15px;">You can link up to 2 alt accounts to bypass the unregistered filter.</p>
            <button onclick="window.linkAltAccountPrompt()" style="background:rgba(52,152,219,0.1); color:var(--accent); border:1px dashed var(--accent); padding:10px; border-radius:8px; cursor:pointer; font-weight:bold; width:100%; transition:0.2s;" onmouseover="this.style.background='rgba(52,152,219,0.2)'" onmouseout="this.style.background='rgba(52,152,219,0.1)'">+ Link Alt Account</button>
          </div>\`;
      }
      
      app.innerHTML = \``;

if (!content.includes('let linkedHtml =')) {
    content = content.replace(htmlGenTarget, htmlGenInject);
}

// 3. Inject ${linkedHtml} into the actual app.innerHTML template
const htmlInjectTarget = `<div id="avatarUploadStatus" style="margin-top:10px; font-size:13px; color:var(--success); font-weight:bold;"></div>
            </div>
          </div>`;

const htmlInjectNew = `<div id="avatarUploadStatus" style="margin-top:10px; font-size:13px; color:var(--success); font-weight:bold;"></div>
            </div>
            
            \${linkedHtml}
          </div>`;

if (content.includes(htmlInjectTarget) && !content.includes('${linkedHtml}')) {
    content = content.replace(htmlInjectTarget, htmlInjectNew);
}

fs.writeFileSync('main.js', content, 'utf8');
console.log("Account Hub UI updated.");
