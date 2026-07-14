const fs = require('fs');
const main = fs.readFileSync('main.js', 'utf8');

const t = `    app.innerHTML = \`
      <div id="accountHubView" class="card" style="max-width:600px; margin:0 auto; text-align:center;">
        <h2 style="color:var(--text-main); margin-top:0;">Account Hub</h2>
        <div style="background:var(--bg-main); padding:20px; border-radius:12px; border:1px solid var(--border); margin-bottom:20px;">
          <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:10px;">
            <div style="width:80px; height:80px; border-radius:50%; background:var(--accent); color:#fff; display:flex; align-items:center; justify-content:center; font-size:32px; font-weight:bold; margin-bottom:10px; overflow:hidden; border:2px solid var(--border);">
              <img src="\\${avatarMap[currentUser.gameId] || \`images/\\${idToNameMap[currentUser.gameId]}.png\`}" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';" style="width:100%; height:100%; object-fit:cover;">
              <div style="display:none; align-items:center; justify-content:center; width:100%; height:100%;">\\${(idToNameMap[currentUser.gameId] || 'U').charAt(0).toUpperCase()}</div>
            </div>
            <h3 style="margin:0; font-size:24px; color:var(--text-main);">\\${idToNameMap[currentUser.gameId] || "Unknown Chief"}</h3>
            <p style="margin:5px 0 0 0; color:var(--text-muted); font-family:monospace; font-size:14px;">Game ID: \\${currentUser.gameId}</p>
          </div>
        </div>
        
        <div style="display:flex; gap:10px; margin-bottom:20px;">
            <button onclick="window.addAltAccountPrompt()" style="flex:1; background:var(--accent); color:#fff; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:15px;">+ Link Alt Account</button>
            <button onclick="window.logout()" style="flex:1; background:transparent; color:var(--danger); border:1px solid var(--danger); padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:15px;">Log Out</button>
        </div>
        \\${linkedHtml}
      </div>
    \`;`;

console.log(main.includes("idToNameMap[currentUser.gameId] || \"Unknown Chief\"}</h3>"));
