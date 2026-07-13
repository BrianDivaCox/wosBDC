const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const oldTableGen = `      for (const [uid, u] of Object.entries(users)) {
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
      }`;

const newTableGen = `      for (const [uid, u] of Object.entries(users)) {
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

if (content.includes(oldTableGen)) {
    content = content.replace(oldTableGen, newTableGen);
    console.log("Table Gen Updated");
} else {
    console.log("Table Gen Failed to Match");
}

const oldRefreshBlock = `          <!-- Tab 2: Users -->
          <div id="tab-users" class="admin-tab-content" style="display:none;">
              <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">`;

const newRefreshBlock = `          <!-- Tab 2: Users -->
          <div id="tab-users" class="admin-tab-content" style="display:none;">
            <div style="display:flex; justify-content:flex-end; margin-bottom:10px;">
                <button onclick="window.refreshAdminUsers()" style="background:var(--accent); color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:14px; display:flex; align-items:center; gap:5px;">
                    <span id="adminRefreshIcon">🔄</span> Refresh User List
                </button>
            </div>
              <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">`;

if (content.includes(oldRefreshBlock)) {
    content = content.replace(oldRefreshBlock, newRefreshBlock);
    console.log("Refresh Button HTML Updated");
} else {
    console.log("Refresh Button HTML Failed to Match");
}

const adminFuncStart = `admin: async () => {
    if (!window.isAdminUser(currentUser)) {
      views.home();
      return;
    }`;

const newRefreshFunc = `
    window.refreshAdminUsers = async () => {
        if (window.showToast) window.showToast("Refreshing user database...", "info");
        const icon = document.getElementById('adminRefreshIcon');
        if (icon) icon.style.animation = 'spin 1s linear infinite';
        
        delete window.liveData["Chief's List"];
        delete window.livePromises["Chief's List"];
        if (window.liveListeners["Chief's List"]) {
            window.liveListeners["Chief's List"]();
            delete window.liveListeners["Chief's List"];
        }
        await views.admin();
        
        // Ensure Users tab stays active
        setTimeout(() => {
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
            const usersBtn = document.querySelector('[data-tab="tab-users"]');
            const usersTab = document.getElementById('tab-users');
            if (usersBtn) usersBtn.classList.add('active');
            if (usersTab) usersTab.style.display = 'block';
        }, 50);
        
        if (window.showToast) window.showToast("User database refreshed!", "success", true);
    };`;

if (content.includes(adminFuncStart) && !content.includes('window.refreshAdminUsers')) {
    content = content.replace(adminFuncStart, adminFuncStart + newRefreshFunc);
    console.log("Refresh Func Updated");
} else {
    console.log("Refresh Func Failed to Match");
}

fs.writeFileSync('main.js', content, 'utf8');
