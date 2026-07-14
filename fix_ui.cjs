const fs = require('fs');
let main = fs.readFileSync('main.js', 'utf8');

const startStr = "  giftcodes: async () => {";
const endStr = "  schedule: async () => {";

const startIndex = main.indexOf(startStr);
const endIndex = main.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find start or end index.");
    process.exit(1);
}

const replacement = `  giftcodes: async () => {
      let contentHtml = '';
      
      if (!currentUser) {
        contentHtml = \`
          <div style="text-align:center; padding:40px 20px;">
            <div style="font-size:48px; margin-bottom:20px;">&#x1F512;</div>
            <h3 style="color:var(--text-main); margin-bottom:10px;">Sign In Required</h3>
            <p style="color:var(--text-muted); margin-bottom:25px; font-size:15px; line-height:1.5;">You must be signed into the Dashboard to securely enable Auto Redeem Perks.</p>
            <button onclick="document.getElementById('authModal').style.display='block'; document.getElementById('authModalOverlay').style.display='block';" style="background:var(--accent); color:#fff; border:none; padding:12px 24px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px;">Sign In / Register</button>
          </div>
        \`;
      } else {
        const chiefName = currentUser.name || idToNameMap[currentUser.gameId] || "Unknown Chief";
        
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
            ? \`<div style="background:rgba(16,185,129,0.1); border:1px solid var(--success); color:var(--success); padding:10px 20px; border-radius:8px; font-weight:bold; font-size:16px; display:inline-flex; align-items:center; gap:8px;">&#x2705; Active Bot Link</div>\`
            : \`<button id="optInPerksBtn" style="background:var(--success); color:var(--bg-main); border:none; padding:12px 24px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px; transition:0.2s; box-shadow:0 4px 15px rgba(16,185,129,0.3); display:inline-flex; align-items:center; gap:8px;">&#x274C; Enable Bot Link</button>
               <div style="margin-top:10px; font-size:12px; color:var(--text-muted);">1-Click Opt-In for Auto Rewards</div>\`;
        
        contentHtml = \`
          <div style="padding:30px 20px;">
            
            <!-- Premium ID Card -->
            <div style="position:relative; max-width:420px; margin:0 auto; background:linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95)); border:1px solid rgba(56,189,248,0.3); border-radius:16px; box-shadow:0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(56,189,248,0.1); overflow:hidden; padding:25px; backdrop-filter:blur(10px);">
                
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

          </div>
        \`;
      }

      app.innerHTML = \`
        <div style="animation: fadeIn 0.3s ease; max-width: 800px; margin: 20px auto;">
          <h2 style="color:var(--text-main); margin-bottom:10px; padding-left:20px; font-size:28px;">Account Hub</h2>
          <p style="color:var(--text-muted); padding-left:20px; margin-bottom:20px; font-size:15px;">Manage your player profile and perk links.</p>
          \${contentHtml}
        </div>
      \`;
      
      // Attach Event Listener if the button exists
      const optInBtn = document.getElementById('optInPerksBtn');
      if (optInBtn) {
        optInBtn.addEventListener('click', async () => {
           if (!currentUser) return;
           optInBtn.disabled = true;
           optInBtn.textContent = 'Linking...';
           const chiefName = currentUser.name || idToNameMap[currentUser.gameId] || "Unknown Chief";
           try {
               const url = \`\${API_BASE_URL}?api=registerNewPlayer&gameId=\${encodeURIComponent(currentUser.gameId)}&name=\${encodeURIComponent(chiefName)}\`;
               const res = await fetch(url).then(r => r.json());
               
               if (res && res.success) {
                   if (res.status === 'duplicate_skipped') {
                       window.showToast("You are already enrolled!", "success", true);
                   } else {
                       window.showToast("Successfully Enrolled in Auto Redeem!", "success", true);
                   }
                   await window.fetchData(true);
                   views.giftcodes();
               } else {
                   throw new Error("Failed to link account");
               }
           } catch(e) {
               console.error(e);
               window.showToast("Error linking account. Try again later.", "error");
               optInBtn.disabled = false;
               optInBtn.textContent = '1-Click Opt-In';
           }
        });
      }
    },
  
`;

const newMain = main.substring(0, startIndex) + replacement + main.substring(endIndex);
fs.writeFileSync('main.js', newMain, 'utf8');
console.log("Success!");
