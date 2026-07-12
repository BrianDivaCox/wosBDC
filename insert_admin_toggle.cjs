const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Add toggle logic for Admin
const toggleMaintStr = `window.toggleMaintenance = async () => {`;
const newToggleMaint = `window.toggleRosterFilter = async () => {
    try {
        await set(ref(db, 'config/rosterRegisteredOnly'), !globalRosterRegisteredOnly);
        window.showToast('Global Roster Filter toggled!', 'success');
        if (document.querySelector('.admin-tab-content')) views.admin();
    } catch(e) {
        alert(e.message);
    }
};

window.toggleMaintenance = async () => {`;

if (content.indexOf('window.toggleRosterFilter') === -1) {
    content = content.replace(toggleMaintStr, newToggleMaint);
    console.log("Added toggleRosterFilter.");
}

// 2. Add to Settings Tab
const settingsTabTarget = `            <!-- Tab 3: Settings -->
            <div id="tab-settings" class="admin-tab-content" style="display:none;">`;

const newSettingsTab = `            <!-- Tab 3: Settings -->
            <div id="tab-settings" class="admin-tab-content" style="display:none;">
              <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <h3 style="margin:0; color:var(--text-main);">Global Chief List Filter</h3>
                  <p style="margin:5px 0 0 0; font-size:12px; color:var(--text-muted);">Permanently hide unregistered users from the Player Lookup list for everyone.</p>
                </div>
                <button onclick="window.toggleRosterFilter()" style="background:\${globalRosterRegisteredOnly ? 'var(--success)' : 'var(--bg-main)'}; color:\${globalRosterRegisteredOnly ? '#fff' : 'var(--text-main)'}; border:1px solid \${globalRosterRegisteredOnly ? 'transparent' : 'var(--border)'}; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:bold; min-width:100px;">
                  \${globalRosterRegisteredOnly ? 'ON' : 'OFF'}
                </button>
              </div>`;

if (content.indexOf('Global Chief List Filter') === -1) {
    content = content.replace(settingsTabTarget, newSettingsTab);
    console.log("Added Global Chief List Filter toggle to HTML.");
}

fs.writeFileSync('main.js', content, 'utf8');
console.log("Admin toggle insertion complete.");
