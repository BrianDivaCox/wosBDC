const fs = require('fs');
let main = fs.readFileSync('main.js', 'utf8');

const startIndex = main.indexOf("app.innerHTML = `\n      <div id=\"accountHubView\" class=\"card\"");
const endIndex = main.indexOf("</div>\n    `;", startIndex) + "</div>\n    `;".length;

const replacement = `
        const chiefName = idToNameMap[currentUser.gameId] || "Unknown Chief";
        
        let isMainEnrolled = false;
        let joinedDateStr = "N/A";
        
        const gcb = window.liveData['giftcodebot'];
        if (gcb && gcb.length > 1) {
            for (let i = 1; i < gcb.length; i++) {
                if (gcb[i] && gcb[i][2] && gcb[i][2].toString().trim() === currentUser.gameId.toString().trim()) {
                    isMainEnrolled = true;
                    if (gcb[i][3]) {
                        try {
                            const d = new Date(gcb[i][3]);
                            if (!isNaN(d)) joinedDateStr = d.toLocaleDateString();
                        } catch(e) {}
                    }
                    break;
                }
            }
        }
        
        let timeActiveStr = "N/A";
        const rosterRawData = window.liveData["Chief's List"];
        if (rosterRawData && rosterRawData.length > 0) {
            for (let i = 1; i < rosterRawData.length; i++) {
                if (rosterRawData[i][0] && rosterRawData[i][0].toString().trim() === chiefName) {
                    if (rosterRawData[i][3]) {
                         try {
                            const d = new Date(rosterRawData[i][3]);
                            if (!isNaN(d)) joinedDateStr = d.toLocaleDateString();
                         } catch(e){}
                    }
                    if (rosterRawData[i][4]) {
                        timeActiveStr = rosterRawData[i][4].toString();
                    }
                    break;
                }
            }
        }

        const avatarSrc = avatarMap[currentUser.gameId] || \`images/\${chiefName}.png\`;
        const isEnrolled = isMainEnrolled || enrolledGameIds.has(currentUser.gameId.toString());

        const botStatusHtml = isEnrolled 
            ? \`<div style="background:rgba(16,185,129,0.1); border:1px solid var(--success); color:var(--success); padding:8px 16px; border-radius:8px; font-weight:bold; font-size:14px; display:inline-flex; align-items:center; gap:8px;">✅ Active Bot Link</div>\`
            : \`<div style="background:rgba(239,68,68,0.1); border:1px solid var(--danger); color:var(--danger); padding:8px 16px; border-radius:8px; font-weight:bold; font-size:14px; display:inline-flex; align-items:center; gap:8px;">❌ No Bot Link</div>\`;

    app.innerHTML = \`
      <div id="accountHubView" style="max-width:800px; margin:0 auto; padding:20px;">
        <h2 style="color:var(--text-main); margin-top:0; text-align:left; font-size:28px;">Account Hub</h2>
        <p style="color:var(--text-muted); margin-bottom:20px; font-size:15px; text-align:left;">Manage your player profile and perk links.</p>
        
        <!-- Premium ID Card -->
        <div style="position:relative; width:100%; max-width:400px; margin:0 auto 30px auto; background:linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95)); border:1px solid rgba(56,189,248,0.3); border-radius:16px; box-shadow:0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(56,189,248,0.1); overflow:hidden; padding:25px; backdrop-filter:blur(10px); text-align:left;">
            
            <!-- Glowing accent line at top -->
            <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:var(--accent); box-shadow:0 0 10px var(--accent);"></div>
            
            <div style="display:flex; align-items:center; gap:20px; margin-bottom:25px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:20px; position:relative; z-index:2;">
                <div style="width:80px; height:80px; border-radius:12px; overflow:hidden; border:2px solid var(--accent); box-shadow:0 4px 15px rgba(0,0,0,0.3); background:var(--bg-secondary); flex-shrink:0;">
                    <img src="\${avatarSrc}" onerror="this.src='images/default_avatar.png'" style="width:100%; height:100%; object-fit:cover;" />
                </div>
                <div style="overflow:hidden;">
                    <h2 style="margin:0 0 5px 0; color:#fff; font-size:24px; letter-spacing:0.5px; text-shadow:0 2px 4px rgba(0,0,0,0.5); white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">\${window.escapeHTML(chiefName)}</h2>
                    <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(0,0,0,0.3); padding:4px 10px; border-radius:20px; border:1px solid rgba(255,255,255,0.1);">
                        <span style="color:var(--accent); font-size:12px; font-weight:bold;">ID:</span>
                        <span style="color:var(--text-main); font-family:monospace; font-size:14px; letter-spacing:1px;">\${currentUser.gameId}</span>
                    </div>
                </div>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:15px; margin-bottom:25px; position:relative; z-index:2;">
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:10px 15px; border-radius:8px;">
                    <span style="color:var(--text-muted); font-size:13px; text-transform:uppercase; letter-spacing:1px;">Joined Date</span>
                    <span style="color:#fff; font-weight:bold; font-size:15px;">\${joinedDateStr}</span>
                </div>
                
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:10px 15px; border-radius:8px;">
                    <span style="color:var(--text-muted); font-size:13px; text-transform:uppercase; letter-spacing:1px;">Time Active</span>
                    <span style="color:var(--accent); font-weight:bold; font-size:13px; text-align:right;">\${timeActiveStr}</span>
                </div>
            </div>
            
            <div style="text-align:center; margin-top:25px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.05); position:relative; z-index:2;">
                \${botStatusHtml}
            </div>
            
            <!-- Watermark -->
            <div style="position:absolute; bottom:-20px; right:-20px; font-size:120px; opacity:0.04; pointer-events:none; transform:rotate(-15deg); z-index:1;">&#x2744;&#xFE0F;</div>
        </div>

        <div style="display:flex; gap:10px; margin-bottom:20px; max-width:400px; margin-left:auto; margin-right:auto;">
            <button onclick="window.addAltAccountPrompt()" style="flex:1; background:var(--accent); color:#fff; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:15px; box-shadow:0 4px 15px rgba(56,189,248,0.2);">+ Link Alt Account</button>
            <button onclick="window.logout()" style="flex:1; background:transparent; color:var(--danger); border:1px solid var(--danger); padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:15px;">Log Out</button>
        </div>
        
        <div style="max-width:500px; margin:0 auto; background:var(--card-bg); border-radius:12px; border:1px solid var(--border); padding:20px; margin-bottom:20px;">
           \${linkedHtml}
        </div>
      </div>
    \`;
`;

mainUpdated = main.substring(0, startIndex) + replacement + main.substring(endIndex);
fs.writeFileSync('main.js', mainUpdated, 'utf8');
console.log("Success!");
