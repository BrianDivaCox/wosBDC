const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const oldLoop = `      for (const [uid, u] of Object.entries(users)) {
        const cName = idToNameMap[u.gameId] || "Unknown";
        const hasAvatar = avatarMap[u.gameId] ? true : false;
        const avatarSrc = avatarMap[u.gameId] || \`images/\${cName}.png\`;
        
        html += \`
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:10px; font-family:monospace; color:var(--accent);">\${u.gameId}</td>
            <td style="padding:10px; font-weight:bold; color:var(--text-main);">\${cName}</td>
            <td style="padding:10px; color:var(--text-muted); font-size:12px;">\${u.email}</td>
            <td style="padding:10px;">
              <div style="width:30px; height:30px; border-radius:50%; overflow:hidden; background:var(--accent);">
                <img src="\${avatarSrc}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.style.display='none';">
              </div>
            </td>
            <td style="padding:10px;">
              \${hasAvatar ? \`<button class="delete-avatar-btn" data-id="\${u.gameId}" style="background:transparent; border:1px solid var(--danger); color:var(--danger); padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;">Delete Avatar</button>\` : \`<span style="color:var(--text-muted); font-size:12px;">Default</span>\`}
            </td>
          </tr>
        \`;
        
        if (u.linkedGameIds && Array.isArray(u.linkedGameIds) && u.linkedGameIds.length > 0) {
            u.linkedGameIds.forEach(altId => {
                const altName = idToNameMap[altId] || "Unknown";
                const altHasAvatar = avatarMap[altId] ? true : false;
                const altAvatarSrc = avatarMap[altId] || \`images/\${altName}.png\`;
                html += \`
                  <tr style="border-bottom:1px solid var(--border); background:rgba(52,152,219,0.05);">
                    <td style="padding:10px; font-family:monospace; color:var(--accent); padding-left:25px;"><span style="color:var(--accent); border:1px solid var(--accent); padding:1px 4px; border-radius:4px; font-size:9px; margin-right:5px; background:rgba(52,152,219,0.1);">ALT</span>\${altId}</td>
                    <td style="padding:10px; font-weight:bold; color:var(--text-main);">\${altName}</td>
                    <td style="padding:10px; color:var(--text-muted); font-size:12px;">(Linked to \${u.gameId})</td>
                    <td style="padding:10px;">
                      <div style="width:30px; height:30px; border-radius:50%; overflow:hidden; background:var(--accent);">
                        <img src="\${altAvatarSrc}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.style.display='none';">
                      </div>
                    </td>
                    <td style="padding:10px;">
                      \${altHasAvatar ? \`<button class="delete-avatar-btn" data-id="\${altId}" style="background:transparent; border:1px solid var(--danger); color:var(--danger); padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;">Delete Avatar</button>\` : \`<span style="color:var(--text-muted); font-size:12px;">Default</span>\`}
                    </td>
                  </tr>
                \`;
            });
        }
      }`;

const newLoop = `      for (const [uid, u] of Object.entries(users)) {
        const cName = idToNameMap[u.gameId] || "Unknown";
        const hasAvatar = avatarMap[u.gameId] ? true : false;
        const avatarSrc = avatarMap[u.gameId] || \`images/\${cName}.png\`;
        
        const hasAlts = (u.linkedGameIds && Array.isArray(u.linkedGameIds) && u.linkedGameIds.length > 0);
        
        html += \`
          <tr style="border-bottom:1px solid var(--border); background:var(--card-bg);">
            <td style="padding:10px; font-family:monospace; color:var(--accent); display:flex; align-items:center; gap:5px;">
              \${hasAlts ? \`<button onclick="document.querySelectorAll('.alt-rows-\${u.gameId}').forEach(r => { if(r.style.display==='none'){r.style.display='table-row'; this.innerHTML='🔽';}else{r.style.display='none'; this.innerHTML='▶️';} })" style="background:none; border:none; color:var(--text-main); cursor:pointer; font-size:12px; padding:0 5px;">▶️</button>\` : \`<span style="width:22px; display:inline-block;"></span>\`}
              \${u.gameId}
            </td>
            <td style="padding:10px; font-weight:bold; color:var(--text-main);">\${cName} \${hasAlts ? \`<span style="background:rgba(52,152,219,0.1); color:var(--accent); border:1px solid var(--accent); padding:2px 6px; border-radius:10px; font-size:10px; margin-left:5px;">\${u.linkedGameIds.length} Alt(s)</span>\` : ''}</td>
            <td style="padding:10px; color:var(--text-muted); font-size:12px;">\${u.email}</td>
            <td style="padding:10px;">
              <div style="width:30px; height:30px; border-radius:50%; overflow:hidden; background:var(--accent);">
                <img src="\${avatarSrc}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.style.display='none';">
              </div>
            </td>
            <td style="padding:10px;">
              \${hasAvatar ? \`<button class="delete-avatar-btn" data-id="\${u.gameId}" style="background:transparent; border:1px solid var(--danger); color:var(--danger); padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;">Delete Avatar</button>\` : \`<span style="color:var(--text-muted); font-size:12px;">Default</span>\`}
            </td>
          </tr>
        \`;
        
        if (hasAlts) {
            u.linkedGameIds.forEach(altId => {
                const altName = idToNameMap[altId] || "Unknown";
                const altHasAvatar = avatarMap[altId] ? true : false;
                const altAvatarSrc = avatarMap[altId] || \`images/\${altName}.png\`;
                html += \`
                  <tr class="alt-rows-\${u.gameId}" style="display:none; border-bottom:1px solid var(--border); background:rgba(52,152,219,0.05);">
                    <td style="padding:10px; font-family:monospace; color:var(--accent); padding-left:40px;">
                       <span style="color:var(--accent); border:1px solid var(--accent); padding:1px 4px; border-radius:4px; font-size:9px; margin-right:5px; background:rgba(52,152,219,0.1);">ALT</span>
                       \${altId}
                    </td>
                    <td style="padding:10px; font-weight:bold; color:var(--text-main);">\${altName}</td>
                    <td style="padding:10px; color:var(--text-muted); font-size:12px;">(Linked to \${u.gameId})</td>
                    <td style="padding:10px;">
                      <div style="width:30px; height:30px; border-radius:50%; overflow:hidden; background:var(--accent);">
                        <img src="\${altAvatarSrc}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.style.display='none';">
                      </div>
                    </td>
                    <td style="padding:10px;">
                      \${altHasAvatar ? \`<button class="delete-avatar-btn" data-id="\${altId}" style="background:transparent; border:1px solid var(--danger); color:var(--danger); padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;">Delete Avatar</button>\` : \`<span style="color:var(--text-muted); font-size:12px;">Default</span>\`}
                    </td>
                  </tr>
                \`;
            });
        }
      }`;

if (content.includes(oldLoop)) {
    content = content.replace(oldLoop, newLoop);
    console.log("Alt Accordion Loop Updated");
} else {
    console.log("Failed to find oldLoop");
}
fs.writeFileSync('main.js', content, 'utf8');
