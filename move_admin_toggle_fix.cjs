const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Remove from Settings Tab just in case it's there
let filterBlock = `              <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <h3 style="margin:0; color:var(--text-main);">Global Chief List Filter</h3>
                  <p style="margin:5px 0 0 0; font-size:12px; color:var(--text-muted);">Permanently hide unregistered users from the Player Lookup list for everyone.</p>
                </div>
                <button onclick="window.toggleRosterFilter()" style="background:\${globalRosterRegisteredOnly ? 'var(--success)' : 'var(--bg-main)'}; color:\${globalRosterRegisteredOnly ? '#fff' : 'var(--text-main)'}; border:1px solid \${globalRosterRegisteredOnly ? 'transparent' : 'var(--border)'}; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:bold; min-width:100px;">
                  \${globalRosterRegisteredOnly ? 'ON' : 'OFF'}
                </button>
              </div>`.replace(/\r\n/g, '\n');

if (content.indexOf(filterBlock) !== -1) {
    content = content.replace(filterBlock + '\n', '');
    content = content.replace(filterBlock, '');
}

// 2. Insert into Users Tab
let usersTabTarget = `          <!-- Tab 2: Users -->
            <div id="tab-users" class="admin-tab-content" style="display:none;">`.replace(/\r\n/g, '\n');

let newUsersTab = `          <!-- Tab 2: Users -->
            <div id="tab-users" class="admin-tab-content" style="display:none;">
              <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <h3 style="margin:0; color:var(--text-main);">Global Chief List Filter</h3>
                  <p style="margin:5px 0 0 0; font-size:12px; color:var(--text-muted);">Permanently hide unregistered users from the Player Lookup list for everyone.</p>
                </div>
                <button onclick="window.toggleRosterFilter()" style="background:\${globalRosterRegisteredOnly ? 'var(--success)' : 'var(--bg-main)'}; color:\${globalRosterRegisteredOnly ? '#fff' : 'var(--text-main)'}; border:1px solid \${globalRosterRegisteredOnly ? 'transparent' : 'var(--border)'}; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:bold; min-width:100px;">
                  \${globalRosterRegisteredOnly ? 'ON' : 'OFF'}
                </button>
              </div>`.replace(/\r\n/g, '\n');

if (content.indexOf(usersTabTarget) !== -1) {
    content = content.replace(usersTabTarget, newUsersTab);
    console.log("Successfully inserted into Users tab.");
} else {
    console.log("Failed to find usersTabTarget!");
}

fs.writeFileSync('main.js', content, 'utf8');
