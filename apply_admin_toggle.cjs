const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Add global state and listener
const maintStateTarget = `let maintenanceMode = false;`;
const newMaintState = `let globalRosterRegisteredOnly = false;
onValue(ref(db, 'config/rosterRegisteredOnly'), (snapshot) => {
  globalRosterRegisteredOnly = snapshot.val() || false;
  // Auto-refresh roster if currently open
  const profContainer = document.getElementById('playerProfileContainer');
  if (profContainer && views && typeof views.roster === 'function') {
      // It's the roster view, might want to re-render but not strictly necessary for real-time
  }
});
let maintenanceMode = false;`;

content = content.replace(maintStateTarget, newMaintState);

// 2. Add toggle logic for Admin
const toggleMaintTarget = `window.toggleMaintenance = async () => {`;
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

content = content.replace(toggleMaintTarget, newToggleMaint);

// 3. Add to Settings Tab
const settingsTabTarget = `              <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--danger); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <h3 style="margin:0; color:var(--danger);">Maintenance Mode</h3>`;
const newSettingsTab = `              <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <h3 style="margin:0; color:var(--text-main);">Global Chief List Filter</h3>
                  <p style="margin:5px 0 0 0; font-size:12px; color:var(--text-muted);">Permanently hide unregistered users from the Player Lookup list for everyone.</p>
                </div>
                <button onclick="window.toggleRosterFilter()" style="background:\${globalRosterRegisteredOnly ? 'var(--success)' : 'var(--bg-main)'}; color:\${globalRosterRegisteredOnly ? '#fff' : 'var(--text-main)'}; border:1px solid \${globalRosterRegisteredOnly ? 'transparent' : 'var(--border)'}; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:bold; min-width:100px;">
                  \${globalRosterRegisteredOnly ? 'ON' : 'OFF'}
                </button>
              </div>

              <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--danger); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <h3 style="margin:0; color:var(--danger);">Maintenance Mode</h3>`;

content = content.replace(settingsTabTarget, newSettingsTab);

// 4. Update roster view logic
const rosterUiTarget = `                      <div style="margin-bottom:15px; font-size:14px; color:var(--text-muted);">
                          <label style="cursor:pointer; display:inline-flex; align-items:center; gap:8px; justify-content:center;">
                              <input type="checkbox" id="registeredOnlyToggle"> 
                              Show Registered Accounts Only
                          </label>
                      </div>`;

const newRosterUi = `                      \${!globalRosterRegisteredOnly ? \`
                      <div style="margin-bottom:15px; font-size:14px; color:var(--text-muted);">
                          <label style="cursor:pointer; display:inline-flex; align-items:center; gap:8px; justify-content:center;">
                              <input type="checkbox" id="registeredOnlyToggle"> 
                              Show Registered Accounts Only
                          </label>
                      </div>\` : ''}`;

content = content.replace(rosterUiTarget, newRosterUi);


const rosterLogicTarget = `        const regToggle = document.getElementById('registeredOnlyToggle');
        
        const renderDropdownOptions = () => {
            const onlyReg = regToggle.checked;`;

const newRosterLogic = `        const regToggle = document.getElementById('registeredOnlyToggle');
        
        const renderDropdownOptions = () => {
            const onlyReg = globalRosterRegisteredOnly || (regToggle && regToggle.checked);`;

content = content.replace(rosterLogicTarget, newRosterLogic);

const rosterListenTarget = `        regToggle.addEventListener('change', () => {
            renderDropdownOptions();
            select.value = "";
            renderCardForChief(""); // Clear profile
        });`;

const newRosterListen = `        if (regToggle) {
            regToggle.addEventListener('change', () => {
                renderDropdownOptions();
                select.value = "";
                renderCardForChief(""); // Clear profile
            });
        }`;

content = content.replace(rosterListenTarget, newRosterListen);

fs.writeFileSync('main.js', content, 'utf8');
console.log("Applied Admin Toggle Patch.");
