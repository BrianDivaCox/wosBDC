import './style.css'
import { initPresence, listenToAuth, loginUser, logoutUser, registerUser, uploadAvatar, deleteAvatar, db, requestPushPermission, listenForForegroundMessages, linkAltAccount, unlinkAltAccount } from './src/firebase.js'
import { ref, onValue, get, set } from 'firebase/database'

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxXjDN5nXVsdojTudMtChy4ts6l4fckyKZGRTa7f689IiI8giejnzys4bnlIZaL28g/exec';

// --- Settings Sidebar Logic ---
const settingsBtn = document.getElementById('settingsBtn');
const closeSidebar = document.getElementById('closeSidebar');
const settingsSidebar = document.getElementById('settingsSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

const openSidebar = () => {
  if(settingsSidebar) settingsSidebar.classList.add('open');
  if(sidebarOverlay) sidebarOverlay.classList.add('active');
};

const closeSidebarFunc = () => {
  if(settingsSidebar) settingsSidebar.classList.remove('open');
  if(sidebarOverlay) sidebarOverlay.classList.remove('active');
};

const mobileSettingsBtn = document.getElementById('mobileSettingsBtn');
if(mobileSettingsBtn) mobileSettingsBtn.addEventListener('click', () => {
  openSidebar();
  if(mobileMenu) mobileMenu.classList.remove('open'); // close the hamburger menu
});

if(settingsBtn) settingsBtn.addEventListener('click', openSidebar);
if(closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
if(sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebarFunc);

// --- Mobile Menu Logic ---
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if(mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    if(mobileMenu) mobileMenu.classList.toggle('open');
  });
}

// --- Theme Logic ---
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'midnight';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Highlight the active card
  document.querySelectorAll('.theme-card').forEach(card => {
    if (card.getAttribute('data-theme') === savedTheme) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
};

document.querySelectorAll('.theme-card').forEach(card => {
  card.addEventListener('click', () => {
    if(!card) return;
    
    const theme = card.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update active card
    document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    
    // Auto-close sidebar to see changes
    closeSidebarFunc();
  });
});

initTheme();

// --- Push Notifications Logic ---
const enablePushBtn = document.getElementById('enablePushBtn');
const pushStatus = document.getElementById('pushStatus');
if (enablePushBtn) {
  enablePushBtn.addEventListener('click', async () => {
    try {
      enablePushBtn.textContent = 'Enabling...';
      enablePushBtn.disabled = true;
      const token = await requestPushPermission(currentUser ? currentUser.uid : null);
      if (token) {
        enablePushBtn.style.display = 'none';
        pushStatus.style.display = 'block';
        pushStatus.style.color = 'var(--success)';
        pushStatus.textContent = 'Subscribed to alerts!';
      }
    } catch(e) {
      console.error(e);
      enablePushBtn.textContent = 'Failed (Try Again)';
      enablePushBtn.disabled = false;
      pushStatus.style.display = 'block';
      pushStatus.style.color = '#ef4444';
      pushStatus.textContent = 'Failed to enable notifications. Ensure they are allowed in your browser settings.';
    }
  });
}

// Setup foreground message listener
listenForForegroundMessages((payload) => {
  const title = payload.notification?.title || 'New Alert';
  const body = payload.notification?.body || '';
  alert(`🔔 ${title}\n${body}`);
});


// --- Auth State & UI Logic ---
let currentUser = null;
const authSidebarBtn = document.getElementById('authSidebarBtn');
const authModalOverlay = document.getElementById('authModalOverlay');
const authModal = document.getElementById('authModal');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const authToggleBtn = document.getElementById('authToggleBtn');
const authToggleText = document.getElementById('authToggleText');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authGameId = document.getElementById('authGameId');
const authErrorMsg = document.getElementById('authErrorMsg');
const authModalTitle = document.getElementById('authModalTitle');

let isRegistering = false;
export let avatarMap = {}; // Global cache for avatars

// Global mappings
export let idToNameMap = {};
export let nameToIdMap = {};

// Listen to Avatars globally
onValue(ref(db, 'avatars'), (snap) => {
  if (snap.val()) {
    avatarMap = snap.val();
  }
});

// Admin System
window.systemAdmins = {};
onValue(ref(db, 'config/admins'), (snap) => {
  window.systemAdmins = snap.val() || {};
  if (typeof checkMaintenanceAccess === 'function') checkMaintenanceAccess();
});

window.linkAltAccountPrompt = async () => {
    let numLinks = (currentUser.linkedGameIds || []).length;
    if (numLinks >= 2) {
        if(window.showToast) window.showToast("Maximum of 2 alt accounts allowed.", "error");
        else alert("Maximum of 2 alt accounts allowed.");
        return;
    }
    let gid = prompt("Enter the exact Game ID of your Alt Account:");
    if (!gid) return;
    
    let chiefName = idToNameMap[gid.trim()];
    if (chiefName) {
        if (!confirm(`Is your Chief Name: ${chiefName}?`)) return;
    } else {
        if (!confirm(`We couldn't find a Chief Name for Game ID ${gid.trim()} on the master list. Do you still want to link it?`)) return;
    }
    
    try {
        await linkAltAccount(currentUser.uid, gid.trim(), currentUser.linkedGameIds || []);
        if(window.showToast) window.showToast("Alt account linked!", "success");
    } catch(e) {
        if(window.showToast) window.showToast(e.message, "error");
        else alert(e.message);
    }
};

window.unlinkAltAccountPrompt = async (gid) => {
    if (!confirm(`Are you sure you want to unlink Game ID ${gid}?`)) return;
    try {
        await unlinkAltAccount(currentUser.uid, gid.toString().trim(), currentUser.linkedGameIds || []);
        if(window.showToast) window.showToast("Account unlinked.", "success");
    } catch(e) {
        if(window.showToast) window.showToast(e.message, "error");
        else alert(e.message);
    }
};

window.isAdminUser = (user) => {
  if (!user) return false;
  if (user.gameId === 318843189) return true;
  return window.systemAdmins[user.gameId] === true;
};

window.grantAdmin = async (gameId) => {
  if (!window.isAdminUser(currentUser)) return;
  if (!confirm(`Are you sure you want to GRANT admin access to Game ID ${gameId}?`)) return;
  try {
    await set(ref(db, `config/admins/${gameId}`), true);
    window.showToast('Admin access granted', 'success');
    if (document.getElementById('adminHubView')) views.admin(); // refresh admin panel if open
  } catch (e) {
    alert(e.message);
  }
};

window.revokeAdmin = async (gameId) => {
  if (!window.isAdminUser(currentUser)) return;
  if (gameId == 318843189) { alert("Cannot revoke Root Admin."); return; }
  if (!confirm(`Are you sure you want to REVOKE admin access for Game ID ${gameId}?`)) return;
  try {
    const updates = {};
    updates[`config/admins/${gameId}`] = null;
    await update(ref(db), updates);
    window.showToast('Admin access revoked', 'error');
    if (document.getElementById('adminHubView')) views.admin();
  } catch (e) {
    alert(e.message);
  }
};

const adminSidebarBtn = document.getElementById('adminSidebarBtn');


// --- Maintenance Mode State ---
let globalRosterRegisteredOnly = false;
onValue(ref(db, 'config/rosterRegisteredOnly'), (snapshot) => {
  globalRosterRegisteredOnly = snapshot.val() || false;
  // Auto-refresh roster if currently open
  const profContainer = document.getElementById('playerProfileContainer');
  if (profContainer && views && typeof views.roster === 'function') {
      // It's the roster view, might want to re-render but not strictly necessary for real-time
  }
});
let maintenanceMode = false;
let maintenanceEndTime = null;
let maintenanceCountdownInterval = null;
const maintenanceOverlay = document.getElementById('maintenanceOverlay');

const checkMaintenanceAccess = () => {
  const isAdmin = window.isAdminUser(currentUser);
  const adminBanner = document.getElementById('adminMaintenanceBanner');
  
  if (maintenanceMode) {
    if (isAdmin) {
      maintenanceOverlay.style.display = 'none';
      if(adminBanner) adminBanner.style.display = 'block';
    } else {
      maintenanceOverlay.style.display = 'flex';
      if(adminBanner) adminBanner.style.display = 'none';
      startMaintenanceCountdown();
    }
  } else {
    maintenanceOverlay.style.display = 'none';
    if(adminBanner) adminBanner.style.display = 'none';
    stopMaintenanceCountdown();
  }
};

// --- Maintenance Countdown Logic ---
function startMaintenanceCountdown() {
  const countdownEl = document.getElementById('maintenanceCountdown');
  const timerEl = document.getElementById('maintenanceTimer');
  const expiredEl = document.getElementById('maintenanceExpired');
  const noTimerEl = document.getElementById('maintenanceNoTimer');
  
  if (!maintenanceEndTime) {
    // No countdown set — show generic message
    if(countdownEl) countdownEl.style.display = 'none';
    if(expiredEl) expiredEl.style.display = 'none';
    if(noTimerEl) noTimerEl.style.display = 'block';
    return;
  }
  
  if(noTimerEl) noTimerEl.style.display = 'none';
  
  // Clear any existing interval
  if (maintenanceCountdownInterval) clearInterval(maintenanceCountdownInterval);
  
  const tick = () => {
    const now = Date.now();
    const diff = maintenanceEndTime - now;
    
    if (diff <= 0) {
      // Countdown expired — show "back any moment" message
      if(countdownEl) countdownEl.style.display = 'none';
      if(expiredEl) expiredEl.style.display = 'block';
      clearInterval(maintenanceCountdownInterval);
      maintenanceCountdownInterval = null;
      return;
    }
    
    // Show countdown
    if(countdownEl) countdownEl.style.display = 'block';
    if(expiredEl) expiredEl.style.display = 'none';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    let timeStr = '';
    if (days > 0) {
      timeStr = `${days}d ${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    } else if (hours > 0) {
      timeStr = `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    } else {
      timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if(timerEl) timerEl.textContent = timeStr;
  };
  
  tick(); // Run immediately
  maintenanceCountdownInterval = setInterval(tick, 1000);
}

function stopMaintenanceCountdown() {
  if (maintenanceCountdownInterval) {
    clearInterval(maintenanceCountdownInterval);
    maintenanceCountdownInterval = null;
  }
  const countdownEl = document.getElementById('maintenanceCountdown');
  const expiredEl = document.getElementById('maintenanceExpired');
  const noTimerEl = document.getElementById('maintenanceNoTimer');
  if(countdownEl) countdownEl.style.display = 'none';
  if(expiredEl) expiredEl.style.display = 'none';
  if(noTimerEl) noTimerEl.style.display = 'block';
}

// Listen for maintenanceEndTime changes
onValue(ref(db, 'config/maintenanceEndTime'), (snapshot) => {
  maintenanceEndTime = snapshot.val() || null;
  if (maintenanceMode) startMaintenanceCountdown();
});

window._executeLogBearTrapWinner = async (name, trap) => {
    window.showToast("Crowning Winner...", "accent");
    try {
        const adminName = currentUser ? (idToNameMap[currentUser.gameId] || "Admin") : "Admin";
        const url = `${API_BASE_URL}?api=addBearTrapEventWin&name=${encodeURIComponent(name)}&trap=${encodeURIComponent(trap)}&admin=${encodeURIComponent(adminName)}`;
        const res = await fetch(url).then(r => r.json());
        
        if (res && res.success) {
            await set(ref(db, `config/bearTrapWinners/${trap}`), {
                name: name,
                score: res.newTotal,
                timestamp: Date.now()
            });
            window.showToast(`✅ Successfully crowned ${name} as Champion! (New Total: ${res.newTotal})`, "success");
            window.searchPlayerFull(name); // Refresh UI
        } else {
            alert(`Error: ${res ? res.message : 'Unknown backend error'}`);
        }
    } catch (e) {
        alert(`Network Error: ${e.message}`);
    }
};

window.promptLogBearTrapWinner = (name) => {
    let trapNum = prompt(`Log Bear Trap Win for ${name}!\n\nWhich event did they win?\nEnter '1' for Bear Trap 1, or '2' for Bear Trap 2:`);
    if (trapNum === '1' || trapNum === '2') {
        window._executeLogBearTrapWinner(name, trapNum);
    } else if (trapNum !== null && trapNum.trim() !== "") {
        alert("Invalid input. Please enter 1 or 2.");
    }
};

window.toggleRosterFilter = async () => {
    try {
        await set(ref(db, 'config/rosterRegisteredOnly'), !globalRosterRegisteredOnly);
        window.showToast('Global Roster Filter toggled!', 'success');
        if (document.querySelector('.admin-tab-content')) views.admin();
    } catch(e) {
        alert(e.message);
    }
};

window.toggleMaintenance = async () => {
  if (maintenanceMode) {
    // Turning OFF — just disable it
    try {
      await set(ref(db, 'config/maintenanceMode'), false);
      await set(ref(db, 'config/maintenanceEndTime'), null);
      window.showToast('Maintenance mode is now OFF', 'success');
      if (app.querySelector('#adminHubView')) views.admin();
    } catch (err) {
      alert(err.message);
    }
    return;
  }
  
  // Turning ON — show duration picker
  const modal = document.createElement('div');
  modal.id = 'maintenanceDurationModal';
  modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); z-index:10001; display:flex; justify-content:center; align-items:center;';
  
  modal.innerHTML = `
    <div style="background:var(--card-bg); border:1px solid var(--border); border-radius:12px; padding:30px; max-width:400px; width:90%; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
      <h2 style="margin:0 0 5px 0; color:var(--danger); font-size:20px;">🚧 Enable Maintenance Mode</h2>
      <p style="margin:0 0 20px 0; color:var(--text-muted); font-size:13px;">How long will maintenance take? This countdown will be shown to all users.</p>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
        <button class="maint-dur-btn" data-minutes="60" style="padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); cursor:pointer; font-weight:bold; font-size:14px; transition:0.2s;">1 hour</button>
        <button class="maint-dur-btn" data-minutes="120" style="padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); cursor:pointer; font-weight:bold; font-size:14px; transition:0.2s;">2 hours</button>
        <button class="maint-dur-btn" data-minutes="1440" style="padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); cursor:pointer; font-weight:bold; font-size:14px; transition:0.2s;">24 hours</button>
        <button class="maint-dur-btn" data-minutes="2880" style="padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); cursor:pointer; font-weight:bold; font-size:14px; transition:0.2s;">48 hours</button>
      </div>
      
      <p style="margin:0 0 5px 0; color:var(--text-main); font-size:13px; font-weight:bold;">Or set a custom duration:</p>
      <div style="display:flex; gap:10px; align-items:center; margin-bottom:15px;">
        <input type="number" id="customMaintHours" placeholder="Hours" min="0.5" step="0.5" style="flex:1; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); font-size:14px; box-sizing:border-box;">
        <button id="customMaintBtn" style="padding:10px 16px; border-radius:8px; border:none; background:var(--accent); color:#fff; cursor:pointer; font-weight:bold; font-size:14px;">Go</button>
      </div>
      
      <p style="margin:0 0 5px 0; color:var(--text-main); font-size:13px; font-weight:bold;">Or set an exact date & time:</p>
      <div style="display:flex; gap:10px; align-items:center; margin-bottom:20px;">
        <input type="date" id="customMaintDateOnly" style="flex:1; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); font-size:14px; box-sizing:border-box;">
        <input type="time" id="customMaintTimeOnly" style="flex:1; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); font-size:14px; box-sizing:border-box;">
        <button id="customMaintDateBtn" style="padding:10px 16px; border-radius:8px; border:none; background:var(--accent); color:#fff; cursor:pointer; font-weight:bold; font-size:14px;">Set</button>
      </div>
      
      <div style="display:flex; gap:10px;">
        <button id="noCountdownBtn" style="flex:1; padding:10px; border-radius:8px; border:1px solid var(--border); background:transparent; color:var(--text-muted); cursor:pointer; font-weight:bold; font-size:13px;">No Countdown</button>
        <button id="cancelMaintBtn" style="flex:1; padding:10px; border-radius:8px; border:1px solid var(--border); background:transparent; color:var(--text-muted); cursor:pointer; font-weight:bold; font-size:13px;">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const activateMaintenance = async (endTime, label) => {
    modal.remove();
    try {
      await set(ref(db, 'config/maintenanceMode'), true);
      await set(ref(db, 'config/maintenanceEndTime'), endTime);
      window.showToast(`Maintenance mode ON${label ? ' — ' + label : ''}`, 'error');
      if (app.querySelector('#adminHubView')) views.admin();
    } catch (err) {
      alert(err.message);
    }
  };
  
  // Preset buttons
  modal.querySelectorAll('.maint-dur-btn').forEach(btn => {
    btn.addEventListener('mouseover', () => { btn.style.borderColor = 'var(--danger)'; btn.style.color = 'var(--danger)'; });
    btn.addEventListener('mouseout', () => { btn.style.borderColor = 'var(--border)'; btn.style.color = 'var(--text-main)'; });
    btn.addEventListener('click', () => {
      let minutes = parseInt(btn.getAttribute('data-minutes'));
      activateMaintenance(Date.now() + (minutes * 60 * 1000), minutes >= 60 ? (minutes/60) + ' hr countdown' : minutes + ' min countdown');
    });
  });
  
  // Custom hours
  document.getElementById('customMaintBtn').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('customMaintHours').value);
    if (!val || val <= 0) { alert('Please enter a valid number of hours.'); return; }
    activateMaintenance(Date.now() + (val * 60 * 60 * 1000), val + ' hr countdown');
  });
  
  // Custom date
  document.getElementById('customMaintDateBtn').addEventListener('click', () => {
    const dateVal = document.getElementById('customMaintDateOnly').value;
    const timeVal = document.getElementById('customMaintTimeOnly').value;
    if (!dateVal || !timeVal) { alert('Please select both a date and a time.'); return; }
    
    // Combine date and time strings (e.g. "2023-10-15T14:30")
    const combinedStr = dateVal + 'T' + timeVal;
    const targetDate = new Date(combinedStr).getTime();
    if (targetDate <= Date.now()) { alert('Please select a future date and time.'); return; }
    activateMaintenance(targetDate, 'countdown set to ' + new Date(combinedStr).toLocaleString());
  });
  
  document.getElementById('noCountdownBtn').addEventListener('click', () => activateMaintenance(null, 'No countdown'));
  document.getElementById('cancelMaintBtn').addEventListener('click', () => modal.remove());
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
};

window.searchPlayerFull = async (name) => {
  window.activeViewFunc = () => window.searchPlayerFull(name);
  const resDiv = document.getElementById('uniEditorRes');
  if (!name || !name.trim()) {
    resDiv.style.display = 'none';
    return;
  }
  
  resDiv.style.display = 'block';
  if (!window.liveData || !window.liveData["activity "]) {
    resDiv.innerHTML = '<div style="text-align:center; padding:20px;"><span style="color:var(--text-muted)">Querying master database...</span></div>';
  }
  
  try {
    const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData] = await Promise.all([
            fetchSheet("activity "),
            fetchSheet("Chief's List"),
            fetchSheet("LeaderBoards"),
            fetchSheet("Showdown History"),
            fetchSheet("Showdown")
          ]);
        
        let usersSnap = null;
        try { usersSnap = await get(ref(db, 'users')); } catch(e) { console.warn("Could not fetch users:", e); }
    
    // Parse Maps
    const rosterMap = {};
    if (rosterRawData && rosterRawData.length > 0) {
      for (let i = 1; i < rosterRawData.length; i++) {
        let chief = rosterRawData[i][0];
        if (chief) rosterMap[chief.toString().trim()] = { giftCodes: rosterRawData[i][2], timeActive: rosterRawData[i][4] };
      }
    }
    
    const lbMap = {};
    const db = window.firebaseDb;
    let btDonationsAllTime = null, btDonationsCurrent = null, bear1 = null, bear2 = null, bearBoth = null, bearAllTime = null;
    let otherLbs = [];
    
    if (lbRawData) {
      for (let r = 0; r < lbRawData.length; r++) {
        for (let c = 0; c < lbRawData[r].length; c++) {
          let cell = lbRawData[r][c];
          if (typeof cell === 'string' && (cell.toLowerCase().includes('leaderboard') || cell.toLowerCase().includes('all-time bear donations'))) {
            let title = cell.replace(/leaderboard/i, '').trim();
            let emoji = "🏆";
            if (title.toLowerCase().includes("bear")) emoji = "🐻";
            else if (title.toLowerCase().includes("showdown")) emoji = "⚔️";
            
            let scoreCol = c + 2;
            if (r + 1 < lbRawData.length) {
              let hc = c;
              while (hc < lbRawData[r+1].length && lbRawData[r+1][hc] !== "") { scoreCol = hc; hc++; }
            }
            
            let dr = r + 2;
            while (dr < lbRawData.length && lbRawData[dr][c] !== "") {
              let pRank = lbRawData[dr][c];
              let pName = lbRawData[dr][c + 1];
              let pScore = lbRawData[dr][scoreCol];
              
              if (pName && pScore && pName.toString().trim() === name) {
                if (typeof pScore === 'number') pScore = pScore.toLocaleString();
                else if (typeof pScore === 'string' && !isNaN(pScore) && pScore.trim() !== "") pScore = Number(pScore).toLocaleString();
                
                let t = title.toLowerCase();
                if (t.includes('all-time showdown')) {}
                else if (t.includes('all-time bear trap')) bearAllTime = {rank: pRank, score: pScore};
                else if (t.includes('bear trap 1')) bear1 = {rank: pRank, score: pScore};
                else if (t.includes('bear trap 2')) bear2 = {rank: pRank, score: pScore};
                else if (t.includes('both bear trap')) bearBoth = {rank: pRank, score: pScore};
                else if (t.includes('all-time bear donations')) btDonationsAllTime = {rank: pRank, score: pScore};
                else if (t.includes('bear donations')) btDonationsCurrent = {rank: pRank, score: pScore};
                else otherLbs.push({ title, score: pScore, rank: pRank, emoji });
              }
              dr++;
            }
          }
        }
      }
    }
    
    const allTimeShowdownMap = {};
    const processShowdownTable = (tableData) => {
      if (!tableData) return;
      for (let r = 0; r < tableData.length; r++) {
        let row = tableData[r];
        if (row.some(c => typeof c === 'string' && c.toLowerCase().trim() === 'ranking')) {
          let nameCol = row.findIndex(c => typeof c === 'string' && (c.toLowerCase().includes('name') || c.toLowerCase().includes('member') || c.toLowerCase().includes('player')));
          let totalCol = row.findIndex(c => typeof c === 'string' && (c.toLowerCase().includes('total')));
          if (nameCol !== -1 && totalCol !== -1) {
            let dr = r + 1;
            while (dr < tableData.length && tableData[dr][nameCol] && (tableData[dr][nameCol].toString().toLowerCase().includes('horns') || tableData[dr][nameCol].toString().toLowerCase().includes('winners'))) dr++;
            while (dr < tableData.length && tableData[dr][nameCol] !== undefined && tableData[dr][nameCol] !== "") {
              let pName = tableData[dr][nameCol];
              let pScore = tableData[dr][totalCol];
              if (pName && (typeof pScore === 'number' || (typeof pScore === 'string' && !isNaN(pScore)))) {
                let safeName = pName.toString().trim();
                if (!allTimeShowdownMap[safeName]) allTimeShowdownMap[safeName] = 0;
                allTimeShowdownMap[safeName] += Number(pScore);
              }
              dr++;
            }
          }
        }
      }
    };
    processShowdownTable(sdHistoryRawData);
    processShowdownTable(sdCurrentRawData);
    
    let dynamicSD = null;
    const sortedShowdownPlayers = Object.entries(allTimeShowdownMap).map(([n, s]) => ({ name: n, score: s })).sort((a, b) => b.score - a.score);
    sortedShowdownPlayers.forEach((p, index) => {
      if (p.name === name) dynamicSD = { score: p.score, rank: index + 1 };
    });
    
    const headers = data[0];
    let showdownActive = false;
    let colIsUpcoming = {};
    for (let c = 1; c < headers.length; c++) {
       let hasAnyTrue = false;
       for (let r = 1; r < data.length; r++) {
          let v = data[r][c];
          if (c === 1 && data[r]) {
             let missed = data[r][1];
             if (missed !== undefined && missed !== null && missed.toString().trim() !== "" && missed !== 0 && missed !== "0") showdownActive = true;
          }
          if (v === true || (typeof v === 'string' && (v.toLowerCase().trim() === 'true' || v.toLowerCase().trim() === 'yes'))) hasAnyTrue = true;
       }
       colIsUpcoming[c] = !hasAnyTrue;
    }
    
    // Find player row in Activity
    let pRow = null;
    for (let i = 1; i < data.length; i++) {
       if (data[i][0] && data[i][0].toString().trim() === name) { pRow = data[i]; break; }
    }
    
    if (!pRow) throw new Error("Player not found in Activity sheet.");
    
    // Generate HTML
    let html = window.generatePlayerProfileHtml(name, pRow, headers, colIsUpcoming, rosterMap[name], null, dynamicSD, showdownActive, bearBoth, bear1, bear2, bearAllTime, btDonationsAllTime, btDonationsCurrent, otherLbs, true);
    
    resDiv.innerHTML = html;
    
  } catch (err) {
    resDiv.innerHTML = `<span style="color:var(--danger)">Error: ${err.message}</span>`;
  }
};

window.savePlayerFull = async (name) => {
  const ptStatus = document.getElementById('uniPtSelect').value;
  const acStatus = document.getElementById('uniAcSelect').value;
  const btAdd = document.getElementById('uniBtAdd').value;
  const resDiv = document.getElementById('uniEditorRes');
  
  const adminName = currentUser ? (idToNameMap[currentUser.gameId] || "Admin") : "Admin";
  
  resDiv.innerHTML = '<span style="color:var(--text-muted)">Saving changes to master sheets...</span>';
  
  try {
    const res = await fetch(`${API_BASE_URL}?api=updateFull&name=${encodeURIComponent(name)}&ptStatus=${encodeURIComponent(ptStatus)}&acStatus=${encodeURIComponent(acStatus)}&btAdd=${encodeURIComponent(btAdd)}&admin=${encodeURIComponent(adminName)}`).then(r => r.json());
    if (res.success) {
      window.showToast("Player updated successfully!", "success");
      let successMsg = `<div style="color:var(--success); font-weight:bold; margin-bottom:5px;">✅ ${res.message}</div>`;
      if (res.btRes && res.btRes.success) {
        successMsg += `<div style="font-size:13px; color:var(--text-muted);">New Bear Total: ${res.btRes.newTotal}</div>`;
      }
      resDiv.innerHTML = successMsg;
    } else {
      resDiv.innerHTML = `<span style="color:var(--danger)">Error: ${res.message}</span>`;
    }
  } catch (err) {
    resDiv.innerHTML = `<span style="color:var(--danger)">Network Error: ${err.message}</span>`;
  }
};

onValue(ref(db, 'config/maintenanceMode'), (snapshot) => {
  maintenanceMode = snapshot.val() || false;
  checkMaintenanceAccess();
});

// Listen to Auth State
listenToAuth((user) => {
  currentUser = user;
  const navIndicator = document.getElementById('navbar-user-indicator');
  
  if (user) {
    let name = idToNameMap[user.gameId] || 'Account';
    if(authSidebarBtn) authSidebarBtn.innerHTML = `👤 ${name}`;
    if(adminSidebarBtn && window.isAdminUser(user)) {
      adminSidebarBtn.style.display = 'block';
    } else if (adminSidebarBtn) {
      adminSidebarBtn.style.display = 'none';
    }
    
    if (navIndicator) {
      navIndicator.innerHTML = `👤 ${name}`;
      navIndicator.style.display = 'flex';
    }
    
    // If they are on the home page, maybe reload or show a toast
    if (app.querySelector('#accountHubView')) views.account(); // Refresh account view if open
  } else {
    if(authSidebarBtn) authSidebarBtn.innerHTML = `👤 Sign In / Register`;
    if(adminSidebarBtn) adminSidebarBtn.style.display = 'none';
    if (navIndicator) navIndicator.style.display = 'none';
    
    if (app.querySelector('#accountHubView') || app.querySelector('#adminHubView')) views.home(); // Kick to home
  }
  
  checkMaintenanceAccess();
});

const openAuthModal = () => {
  authErrorMsg.style.display = 'none';
  authModal.style.display = 'block';
  authModalOverlay.classList.add('active');
};
const closeAuthModal = () => {
  authModal.style.display = 'none';
  authModalOverlay.classList.remove('active');
};

if(authSidebarBtn) authSidebarBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (currentUser) {
    // Navigate to Account Hub
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (mobileMenu) mobileMenu.classList.remove('open');
    settingsSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    views.account();
  } else {
    settingsSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    openAuthModal();
  }
});

if(adminSidebarBtn) adminSidebarBtn.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (mobileMenu) mobileMenu.classList.remove('open');
  settingsSidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
  views.admin();
});

if(closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);
if(authModalOverlay) authModalOverlay.addEventListener('click', closeAuthModal);

if(authToggleBtn) authToggleBtn.addEventListener('click', (e) => {
  e.preventDefault();
  isRegistering = !isRegistering;
  authErrorMsg.style.display = 'none';
  if (isRegistering) {
    authModalTitle.textContent = 'Create Account';
    authGameId.style.display = 'block';
    authGameId.value = '';
    if(authChiefConfirm) authChiefConfirm.style.display = 'none';
    authSubmitBtn.textContent = 'Create Account';
    authToggleText.textContent = 'Already have an account?';
    authToggleBtn.textContent = 'Sign In';
  } else {
    authModalTitle.textContent = 'Sign In';
    authGameId.style.display = 'none';
    if(authChiefConfirm) authChiefConfirm.style.display = 'none';
    authSubmitBtn.textContent = 'Sign In';
    authToggleText.textContent = 'Need an account?';
    authToggleBtn.textContent = 'Register';
  }
});

const authChiefConfirm = document.getElementById('authChiefConfirm');
if (authGameId && authChiefConfirm) {
  authGameId.addEventListener('input', () => {
    if (!isRegistering) return;
    const val = authGameId.value.trim();
    if (!val) {
      authChiefConfirm.style.display = 'none';
      return;
    }
    authChiefConfirm.style.display = 'block';
    if (idToNameMap[val]) {
      authChiefConfirm.innerHTML = `Is your Chief Name: <strong style="color:var(--success)">${idToNameMap[val]}</strong>?`;
    } else {
      authChiefConfirm.innerHTML = `<span style="color:var(--danger)">Game ID not found in master database.</span>`;
    }
  });
}

const showPasswordBtn = document.getElementById('showPasswordBtn');
if(showPasswordBtn) showPasswordBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (authPassword.type === 'password') {
    authPassword.type = 'text';
    showPasswordBtn.textContent = '🙈';
  } else {
    authPassword.type = 'password';
    showPasswordBtn.textContent = '👁️';
  }
});

if(authSubmitBtn) authSubmitBtn.addEventListener('click', async () => {
  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value;
  const gameId = authGameId.value.trim();
  
  if (!email || !password) {
    authErrorMsg.textContent = 'Email and password required.';
    authErrorMsg.style.display = 'block';
    return;
  }
  
  try {
    authSubmitBtn.disabled = true;
    authSubmitBtn.textContent = 'Loading...';
    
    if (isRegistering) {
      if (!gameId) throw new Error('Game ID is required.');
      await registerUser(email, password, gameId);
      window.showToast("Account created & signed in!", "success");
    } else {
      await loginUser(email, password);
      window.showToast("Successfully signed in!", "success");
    }
    
    closeAuthModal();
  } catch(err) {
    authErrorMsg.textContent = err.message;
    authErrorMsg.style.display = 'block';
  } finally {
    authSubmitBtn.disabled = false;
    authSubmitBtn.textContent = isRegistering ? 'Create Account' : 'Sign In';
  }
});


// --- Changelog Modal ---
const versionBadge = document.getElementById('versionBadge');
const changelogModal = document.getElementById('changelogModal');
const changelogModalOverlay = document.getElementById('changelogModalOverlay');
const closeChangelogBtn = document.getElementById('closeChangelogBtn');
const changelogContent = document.getElementById('changelogContent');

import pkg from './package.json';
if (versionBadge) versionBadge.innerHTML = `v${pkg.version}`;

const closeChangelogModal = () => {
  if (changelogModal) changelogModal.style.display = 'none';
  if (changelogModalOverlay) changelogModalOverlay.classList.remove('active');
};

if (closeChangelogBtn) closeChangelogBtn.addEventListener('click', closeChangelogModal);
if (changelogModalOverlay) changelogModalOverlay.addEventListener('click', closeChangelogModal);

if (versionBadge) versionBadge.addEventListener('click', async () => {
  if (changelogModal) changelogModal.style.display = 'block';
  if (changelogModalOverlay) changelogModalOverlay.classList.add('active');
  
  try {
    changelogContent.innerHTML = '<span style="color:var(--text-muted)">Loading changelog...</span>';
    const response = await fetch(`https://raw.githubusercontent.com/BrianDivaCox/wosBDC/main/CHANGELOG.md?t=${Date.now()}`);
    if (!response.ok) throw new Error('Failed to fetch changelog from repository');
    let md = await response.text();
    
    // Basic Markdown parser for headings and bullets
    md = md.replace(/### (.*)/g, '<h4 style="color:var(--accent); margin-bottom:5px; margin-top:15px;">$1</h4>');
    md = md.replace(/## \[(.*?)\] - (.*)/g, '<h3 style="color:var(--text-main); border-bottom:1px solid var(--border); padding-bottom:5px; margin-top:20px;">Version $1 <span style="font-size:12px; color:var(--text-muted); font-weight:normal; float:right;">$2</span></h3>');
    md = md.replace(/# (.*)/g, ''); // Remove main title
    md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    md = md.replace(/`([^`]+)`/g, '<code style="background:var(--bg-main); padding:2px 4px; border-radius:4px; color:var(--danger);">$1</code>');
    md = md.replace(/^- (.*)/gm, '<li style="margin-bottom:5px;">$1</li>');
    
    // Wrap consecutive li elements in ul
    md = md.replace(/(<li.*<\/li>\n?)+/g, match => `<ul style="padding-left:20px; margin-top:5px; color:var(--text-main);">${match}</ul>`);
    
    changelogContent.innerHTML = md;
  } catch (err) {
    changelogContent.innerHTML = `<span style="color:var(--danger)">Error loading changelog: ${err.message}</span>`;
  }
});

// --- Routing & Views ---
const app = document.getElementById('app');
const navLinks = document.querySelectorAll('.nav-link');

window.showToast = (message, type = 'success', sticky = false) => {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  
  if (sticky) {
    toast.classList.add('sticky');
    toast.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:15px;">
        <div>${message}</div>
        <button class="toast-close" style="background:var(--bg-main); border:1px solid var(--border); color:var(--text-main); cursor:pointer; font-size:16px; font-weight:bold; padding:2px 8px; border-radius:4px;">&times;</button>
      </div>
    `;
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'fadeOutToast 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    });
  } else {
    toast.innerHTML = message;
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 3000);
  }
  
  container.appendChild(toast);
};


const renderLoading = (message) => {
  app.innerHTML = `<div class="card"><div class="loading">⏳ ${message}...</div></div>`;
};

const renderError = (err) => {
  app.innerHTML = `<div class="card"><div class="loading" style="color:var(--danger)">❌ Error: ${err}</div></div>`;
};

window.liveData = {};
window.liveListeners = {};
window.livePromises = {};
window.activeViewFunc = null;

const fetchSheet = async (sheetName) => {
  if (window.liveData[sheetName]) return window.liveData[sheetName];
  if (window.livePromises[sheetName]) return window.livePromises[sheetName];
  
  window.livePromises[sheetName] = new Promise((resolve, reject) => {
    const sheetRef = ref(db, `sheets/${sheetName}`);
    window.liveListeners[sheetName] = onValue(sheetRef, (snapshot) => {
      const data = snapshot.val();
      const isUpdate = window.liveData[sheetName] !== undefined;
      
      window.liveData[sheetName] = data;
      
      if (!isUpdate) {
        resolve(data);
      } else {
        if (window.activeViewFunc) {
          console.log(`Live sync: ${sheetName} updated. Re-rendering view...`);
          window.activeViewFunc();
        }
      }
    }, async (error) => {
      console.warn(`Cache miss for ${sheetName}, falling back to GAS`);
      try {
        const res = await fetch(`${API_BASE_URL}?api=${encodeURIComponent(sheetName)}`);
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (e) {
          if (text.trim().startsWith('<')) {
             throw new Error("Database API is currently unavailable.");
          }
          throw new Error("Invalid JSON response.");
        }
        if (json.error) throw new Error(json.error);
        if (!window.liveData[sheetName]) resolve(json.data);
      } catch (err) {
        if (!window.liveData[sheetName]) reject(err);
      }
    });
  });
  
  return window.livePromises[sheetName];
};

// Immediately fetch mapping data to ensure auth UI is populated
fetchSheet("Chief's List").then(rosterRawData => {
  if (rosterRawData && rosterRawData.length > 0) {
    for (let i = 1; i < rosterRawData.length; i++) {
      let name = rosterRawData[i][0];
      let id = rosterRawData[i][1];
      if (name && id) {
         idToNameMap[id] = name.toString().trim();
         nameToIdMap[name.toString().trim()] = id.toString().trim();
      }
    }
    // Update navbar if user already loaded
    if (currentUser && authSidebarBtn) {
       authSidebarBtn.innerHTML = `👤 ${idToNameMap[currentUser.gameId] || 'Account'}`;
    }
    // Update Account Hub if it is currently open
    const accHubView = document.getElementById('accountHubView');
    if (accHubView && currentUser) {
       views.account(); // re-render account view with correct name
    }
  }
}).catch(console.error);

// --- Formatters ---
const formatCell = (cell) => {
  if (cell === true || cell === 'TRUE' || cell === 'true') {
    return `<input type="checkbox" checked onclick="return false;" style="accent-color: var(--accent); transform: scale(1.2); cursor: default;">`;
  } else if (cell === false || cell === 'FALSE' || cell === 'false') {
    return `<input type="checkbox" onclick="return false;" style="transform: scale(1.2); cursor: default;">`;
  }
  return cell;
};

// --- Dev Mode Deployment Tracker ---
const devModeToggle = document.getElementById('devModeToggle');
const devDeployBanner = document.getElementById('devDeployBanner');
const devModeSlider = document.getElementById('devModeSlider');
let devModePollingInterval = null;
let lastDeployStatus = null;

const checkDeploymentStatus = async () => {
  const statusEl = document.getElementById('github-deploy-status');
  try {
    const res = await fetch('https://api.github.com/repos/BrianDivaCox/wosBDC/actions/runs?branch=main&per_page=1');
    const data = await res.json();
    if (data && data.workflow_runs && data.workflow_runs.length > 0) {
      const latestRun = data.workflow_runs[0];
      const status = latestRun.status;
      const conclusion = latestRun.conclusion;
      
      const isDevMode = localStorage.getItem('devMode') === 'true';
      
      if (status === 'in_progress' || status === 'queued') {
        if (statusEl) statusEl.innerHTML = `<span style="color:#eab308; display:flex; align-items:center; gap:5px;"><span style="display:inline-block; animation: spin 2s linear infinite;">⏳</span> Building & Deploying...</span>`;
        if (isDevMode && devDeployBanner) {
            devDeployBanner.style.display = 'block';
            devDeployBanner.style.backgroundColor = '#f59e0b';
            devDeployBanner.style.color = '#fff';
            devDeployBanner.innerHTML = '🚀 Deployment in progress... Auto-refresh enabled.';
            lastDeployStatus = 'in_progress';
        }
      } else if (status === 'completed' && conclusion === 'success') {
        if (statusEl) statusEl.innerHTML = `<span style="color:var(--success);">✅ Live & Up to Date</span>`;
        if (isDevMode && lastDeployStatus === 'in_progress') {
            window.location.reload(true);
        } else if (isDevMode && devDeployBanner) {
            devDeployBanner.style.display = 'block';
            devDeployBanner.style.backgroundColor = '#10b981';
            devDeployBanner.style.color = '#fff';
            devDeployBanner.innerHTML = '🟢 Live and up to date.';
            lastDeployStatus = 'completed';
        }
      } else if (status === 'completed' && conclusion === 'failure') {
        if (statusEl) statusEl.innerHTML = `<span style="color:var(--danger);">❌ Deployment Failed</span>`;
      } else {
        if (statusEl) statusEl.innerHTML = `<span style="color:var(--text-muted);">Status: ${status}</span>`;
      }
    } else if (data && data.message && data.message.includes('rate limit')) {
      if (statusEl) statusEl.innerHTML = `<span style="color:var(--danger);">⚠️ GitHub API Rate Limited. Please wait.</span>`;
    }
  } catch (err) {
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--danger);">Error fetching status</span>`;
  }
};


// Auto start polling if dev mode is enabled on load
if (localStorage.getItem('devMode') === 'true') {
    checkDeploymentStatus();
    devModePollingInterval = setInterval(checkDeploymentStatus, 10000);
} else {
    checkDeploymentStatus();
}

// Also check when the user opens the sidebar
const settingsBtnEl = document.getElementById('settingsBtn');
if (settingsBtnEl) settingsBtnEl.addEventListener('click', checkDeploymentStatus);

// Add spinning animation for the loader
const style = document.createElement('style');
style.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(style);

// View renderers
const views = {
  admin: async () => {
    if (!window.isAdminUser(currentUser)) {
      views.home();
      return;
    }
    
        try {
      const [usersSnap, rosterRawData] = await Promise.all([
        get(ref(db, 'users')),
        fetchSheet("Chief's List")
      ]);
      const users = usersSnap.val() || {};
      
      const players = [];
      if (rosterRawData && rosterRawData.length > 0) {
        for (let i = 1; i < rosterRawData.length; i++) {
          if (rosterRawData[i][0] && rosterRawData[i][0].toString().trim() !== "") {
            players.push(rosterRawData[i][0].toString().trim());
          }
        }
      }
      players.sort((a, b) => a.localeCompare(b));
      let playerOptions = `<option value="">-- Select a Chief --</option>`;
      players.forEach(p => {
        playerOptions += `<option value="${p}">${p}</option>`;
      });

      window.sendBroadcastPush = async () => {
        const title = document.getElementById('adminPushTitle').value.trim();
        const body = document.getElementById('adminPushBody').value.trim();
        const statusEl = document.getElementById('adminPushStatus');
        
        if (!title || !body) {
          statusEl.textContent = "Title and Body are required.";
          statusEl.style.color = "var(--danger)";
          return;
        }
        
        if (!confirm("Are you sure you want to broadcast this notification to all subscribed users?")) {
          return;
        }
        
        statusEl.textContent = "Sending...";
        statusEl.style.color = "var(--text-muted)";
        
        try {
          const res = await fetch(API_BASE_URL, {
            method: 'POST',
            body: JSON.stringify({ api: 'sendPush', title: title, body: body }),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
          }).then(r => r.json());
          
          if (res.success) {
            statusEl.textContent = res.message;
            statusEl.style.color = "var(--success)";
            document.getElementById('adminPushTitle').value = "";
            document.getElementById('adminPushBody').value = "";
          } else {
            statusEl.textContent = "Error: " + res.message;
            statusEl.style.color = "var(--danger)";
          }
        } catch(e) {
          statusEl.textContent = "Network Error: " + e.message;
          statusEl.style.color = "var(--danger)";
        }
      };
      
      let html = `
        <div class="card" style="max-width:800px; margin:0 auto; animation: fadeIn 0.3s ease;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h2 style="color:var(--danger); margin:0;">🛠️ Admin Control Panel</h2>
          </div>
          
          <!-- Tab Navigation -->
          <div style="display:flex; gap:10px; margin-bottom:20px; border-bottom:1px solid var(--border); padding-bottom:10px;">
            <button class="admin-tab-btn active" data-tab="tab-tools" style="background:none; border:none; color:var(--accent); font-weight:bold; font-size:16px; cursor:pointer; padding:5px 10px; border-bottom:2px solid var(--accent);">🛠️ Daily Tools</button>
            <button class="admin-tab-btn" data-tab="tab-users" style="background:none; border:none; color:var(--text-muted); font-weight:bold; font-size:16px; cursor:pointer; padding:5px 10px; border-bottom:2px solid transparent;">👥 Users</button>
            <button class="admin-tab-btn" data-tab="tab-settings" style="background:none; border:none; color:var(--text-muted); font-weight:bold; font-size:16px; cursor:pointer; padding:5px 10px; border-bottom:2px solid transparent;">⚙️ Settings</button>
            <button class="admin-tab-btn" data-tab="tab-logs" style="background:none; border:none; color:var(--text-muted); font-weight:bold; font-size:16px; cursor:pointer; padding:5px 10px; border-bottom:2px solid transparent;">📋 Logs</button>
          </div>
          
          <!-- Tab 1: Daily Tools -->
          <div id="tab-tools" class="admin-tab-content" style="display:block;">
            <div style="background:var(--bg-main); padding:20px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px; text-align:center;">
              <h3 style="margin:0 0 10px 0; color:var(--text-main);">Bear Trap Automation</h3>
              <p style="margin:0 0 15px 0; font-size:13px; color:var(--text-muted);">Quickly process multiple Bear Trap donations at once.</p>
              <button onclick="views.beartrap()" style="background:var(--accent); color:#fff; border:none; padding:12px 24px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:16px; width:100%; max-width:300px;">🥩 Open Multi-BT Donations</button>
            </div>
            
            <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px;">
              <div style="margin-bottom:15px;">
                <h3 style="margin:0; color:var(--accent);">Player Database Editor</h3>
                <p style="margin:5px 0 0 0; font-size:12px; color:var(--text-muted);">Select a chief and click their red "Missed" metrics below to instantly mark them as Participated for Alliance Championship, Polar Terrors, Mercenary Prestige, or Voter. Use the green button to add Bear Donations.</p>
              </div>
              
              <div style="display:flex; gap:10px; margin-bottom:10px;">
                <select id="uniSearchInput" style="flex:1; padding:10px 12px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main); font-size:16px; font-weight:bold; cursor:pointer;">
                  ${playerOptions}
                </select>
                <button onclick="window.searchPlayerFull(document.getElementById('uniSearchInput').value)" style="background:var(--accent); color:#fff; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:16px;">Search</button>
              </div>
              
              <div id="uniEditorRes" style="display:none; flex-direction:column; gap:12px; border-top:1px solid var(--border); padding-top:15px;">
                 <!-- Populated by JS -->
              </div>
            </div>

            <!-- Push Notification Broadcast -->
            <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px;">
              <h3 style="margin:0 0 5px 0; color:var(--accent);">Broadcast Push Notification</h3>
              <p style="margin:0 0 15px 0; font-size:12px; color:var(--text-muted);">Send an instant alert to all registered devices.</p>
              <input type="text" id="adminPushTitle" placeholder="Notification Title (e.g. Bear Trap Starting!)" style="width:100%; padding:10px; margin-bottom:10px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main); font-weight:bold;">
              <textarea id="adminPushBody" placeholder="Message Body" style="width:100%; padding:10px; margin-bottom:10px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main); min-height:80px;"></textarea>
              <button onclick="window.sendBroadcastPush()" style="background:var(--danger); color:#fff; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; font-weight:bold; width:100%;">Send Alert 🚀</button>
              <div id="adminPushStatus" style="font-size:12px; font-weight:bold; margin-top:10px; text-align:center;"></div>
            </div>
          </div>
          
          <!-- Tab 2: Users -->
          <div id="tab-users" class="admin-tab-content" style="display:none;">
              <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <h3 style="margin:0; color:var(--text-main);">Global Chief List Filter</h3>
                  <p style="margin:5px 0 0 0; font-size:12px; color:var(--text-muted);">Permanently hide unregistered users from the Player Lookup list for everyone.</p>
                </div>
                <button onclick="window.toggleRosterFilter()" style="background:${globalRosterRegisteredOnly ? 'var(--success)' : 'var(--bg-main)'}; color:${globalRosterRegisteredOnly ? '#fff' : 'var(--text-main)'}; border:1px solid ${globalRosterRegisteredOnly ? 'transparent' : 'var(--border)'}; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:bold; min-width:100px;">
                  ${globalRosterRegisteredOnly ? 'ON' : 'OFF'}
                </button>
              </div>
            <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px;">
              <div style="margin-bottom:15px;">
                <h3 style="margin:0; color:var(--accent);">🛡️ Staff Roles (Admins)</h3>
                <p style="margin:5px 0 0 0; font-size:12px; color:var(--text-muted);">List of players who currently have Admin Dashboard access. You can grant admin access directly from a player's profile card.</p>
              </div>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center; background:var(--card-bg); padding:10px; border-radius:8px; border:1px solid var(--border);">
                  <div style="font-weight:bold; color:var(--text-main);">Diva (Root Admin)</div>
                  <div style="color:var(--text-muted); font-size:12px;">318843189</div>
                </div>
                ${Object.keys(window.systemAdmins).map(gid => {
                   let n = idToNameMap[gid] || "Unknown Player";
                   return `
                   <div style="display:flex; justify-content:space-between; align-items:center; background:var(--card-bg); padding:10px; border-radius:8px; border:1px solid var(--border);">
                     <div style="font-weight:bold; color:var(--text-main);">${n}</div>
                     <div style="display:flex; gap:10px; align-items:center;">
                       <div style="color:var(--text-muted); font-size:12px;">${gid}</div>
                       <button onclick="window.revokeAdmin('${gid}')" style="background:var(--danger); color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer; font-weight:bold;">Revoke</button>
                     </div>
                   </div>
                   `;
                }).join('')}
              </div>
            </div>
          
          <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--border);">
            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; text-align:left;">
                <thead>
                  <tr style="border-bottom:2px solid var(--border); color:var(--text-muted);">
                    <th style="padding:10px;">Game ID</th>
                    <th style="padding:10px;">Chief Name</th>
                    <th style="padding:10px;">Email</th>
                    <th style="padding:10px;">Avatar</th>
                    <th style="padding:10px;">Actions</th>
                  </tr>
                </thead>
                <tbody>
      `;
      
      for (const [uid, u] of Object.entries(users)) {
        const cName = idToNameMap[u.gameId] || "Unknown";
        const hasAvatar = avatarMap[u.gameId] ? true : false;
        const avatarSrc = avatarMap[u.gameId] || `images/${cName}.png`;
        
        html += `
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:10px; font-family:monospace; color:var(--accent);">${u.gameId}</td>
            <td style="padding:10px; font-weight:bold; color:var(--text-main);">${cName}</td>
            <td style="padding:10px; color:var(--text-muted); font-size:12px;">${u.email}</td>
            <td style="padding:10px;">
              <div style="width:30px; height:30px; border-radius:50%; overflow:hidden; background:var(--accent);">
                <img src="${avatarSrc}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.style.display='none';">
              </div>
            </td>
            <td style="padding:10px;">
              ${hasAvatar ? `<button class="delete-avatar-btn" data-id="${u.gameId}" style="background:transparent; border:1px solid var(--danger); color:var(--danger); padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;">Delete Avatar</button>` : `<span style="color:var(--text-muted); font-size:12px;">Default</span>`}
            </td>
          </tr>
        `;
      }
      
      html += `</tbody></table></div></div>
          </div>
          
          <!-- Tab 3: Settings -->
          <div id="tab-settings" class="admin-tab-content" style="display:none;">
            <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--danger); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <h3 style="margin:0; color:var(--danger);">Maintenance Mode</h3>
                <p style="margin:5px 0 0 0; font-size:12px; color:var(--text-muted);">Lock out all non-admin users and display a maintenance screen.</p>
              </div>
              <button onclick="window.toggleMaintenance()" style="background:${maintenanceMode ? 'var(--bg-main)' : 'var(--danger)'}; color:${maintenanceMode ? 'var(--success)' : '#fff'}; border:1px solid ${maintenanceMode ? 'var(--success)' : 'transparent'}; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:bold; min-width:100px;">
                ${maintenanceMode ? '🟢 Turn OFF' : '🔴 Turn ON'}
              </button>
            </div>
            
            <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <h3 style="margin:0; color:var(--text-main);">Dev Mode (Track Deployment)</h3>
                <p style="margin:5px 0 0 0; font-size:12px; color:var(--text-muted);">When enabled, checks for active GitHub deployments and auto-refreshes the page.</p>
                <div id="github-deploy-status" style="margin-top:8px; font-weight:bold; font-size:13px; color:var(--text-muted);">
                  ⏳ Fetching status...
                </div>
              </div>
              <label style="position:relative; display:inline-block; width:40px; height:20px; flex-shrink:0;">
                <input type="checkbox" id="devModeToggleAdmin" style="opacity:0; width:0; height:0;">
                <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:var(--border); transition:.4s; border-radius:20px;">
                  <span id="devModeSliderAdmin" style="position:absolute; content:''; height:14px; width:14px; left:3px; bottom:3px; background-color:white; transition:.4s; border-radius:50%;"></span>
                </span>
              </label>
            </div>
            
            <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px;">
              <h3 style="margin:0; color:var(--text-main); margin-bottom:10px;">🔄 Live Database Sync Status</h3>
              <p style="margin:0 0 15px 0; font-size:12px; color:var(--text-muted);">Shows the exact timestamp of when each master sheet was last pushed to Firebase.</p>
              <div id="adminSyncStatusList">
                 <div style="color:var(--text-muted); font-size:12px; text-align:center; padding:10px;">Loading sync data from Firebase...</div>
              </div>
            </div>
          </div>
          
          <!-- Tab 4: Logs -->
          <div id="tab-logs" class="admin-tab-content" style="display:none;">
            <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--border); display:flex; flex-direction:column; gap:15px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0; color:var(--text-main);">📋 Admin Activity Logs</h3>
                <div style="display:flex; gap:10px;">
                  <select id="adminLogFilter" onchange="window.filterAdminLogs()" style="padding:8px 12px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main);">
                    <option value="">All Admins</option>
                  </select>
                  <input type="text" id="adminLogSearch" placeholder="Search logs..." onkeyup="window.filterAdminLogs()" style="padding:8px 12px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main); width:200px;">
                </div>
              </div>
              <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; text-align:left;">
                  <thead>
                    <tr style="border-bottom:2px solid var(--border); color:var(--text-muted);">
                      <th style="padding:10px;">Date & Time</th>
                      <th style="padding:10px;">Admin</th>
                      <th style="padding:10px;">Player</th>
                      <th style="padding:10px;">Action / Amount</th>
                      <th style="padding:10px;">New Total</th>
                    </tr>
                  </thead>
                  <tbody id="adminLogsTableBody">
                    <tr><td colspan="5" style="padding:15px; text-align:center; color:var(--text-muted);">Loading logs from Firebase...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>`;
      app.innerHTML = html;
      
      // Bind Admin Tabs
      document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.admin-tab-btn').forEach(b => {
            b.style.color = 'var(--text-muted)';
            b.style.borderBottomColor = 'transparent';
          });
          document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
          
          e.target.style.color = 'var(--accent)';
          e.target.style.borderBottomColor = 'var(--accent)';
          document.getElementById(e.target.getAttribute('data-tab')).style.display = 'block';
        });
      });
      
      // Listen to Live Sync Status
      const syncStatusDiv = document.getElementById('adminSyncStatusList');
      if (syncStatusDiv) {
        if (window.adminSyncListener) window.adminSyncListener();
        window.adminSyncListener = onValue(ref(db, 'system/lastSync'), (snap) => {
          const data = snap.val() || {};
          let html = Object.keys(data).sort().map(sheet => {
            let timeStr = new Date(data[sheet]).toLocaleString();
            return `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">
              <span style="color:var(--text-main); font-weight:bold;">${sheet}</span>
              <span style="color:var(--success); font-size:12px; font-weight:bold;">${timeStr}</span>
            </div>`;
          }).join('');
          if (html === '') html = '<div style="color:var(--text-muted); font-size:12px; text-align:center; padding:10px;">No sync data available yet.</div>';
          syncStatusDiv.innerHTML = html;
        });
      }
      
      // Bind Dev Mode toggle in Admin Panel
      const devModeToggleAdmin = document.getElementById('devModeToggleAdmin');
      const devModeSliderAdmin = document.getElementById('devModeSliderAdmin');
      if (devModeToggleAdmin) {
        const isDevMode = localStorage.getItem('devMode') === 'true';
        devModeToggleAdmin.checked = isDevMode;
        if (isDevMode && devModeSliderAdmin) {
          devModeSliderAdmin.style.transform = 'translateX(20px)';
        }
        
        devModeToggleAdmin.addEventListener('change', (e) => {
          const enabled = e.target.checked;
          localStorage.setItem('devMode', enabled);
          if (devModeSliderAdmin) {
            devModeSliderAdmin.style.transform = enabled ? 'translateX(20px)' : 'translateX(0)';
          }
          
          if (enabled) {
            checkDeploymentStatus();
            if (devModePollingInterval) clearInterval(devModePollingInterval);
            devModePollingInterval = setInterval(checkDeploymentStatus, 10000);
          } else {
            if (devModePollingInterval) clearInterval(devModePollingInterval);
            const banner = document.getElementById('devDeployBanner');
            if (banner) banner.style.display = 'none';
          }
        });
      }
      
      // Bind delete avatar buttons
      document.querySelectorAll('.delete-avatar-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if (!confirm("Are you sure you want to delete this avatar?")) return;
          const gid = e.target.getAttribute('data-id');
          try {
            e.target.textContent = "Deleting...";
            await deleteAvatar(gid);
            views.admin(); // Refresh view
          } catch(err) {
             alert(err.message);
          }
        });
      });
      
      // Firebase listener for Logs tab
      const adminLogRef = ref(db, 'sheets/Admin Log');
      onValue(adminLogRef, (snapshot) => {
        if (!document.getElementById('adminLogsTableBody')) return;
        const logsData = snapshot.val();
        let tbodyHtml = '';
        let uniqueAdmins = new Set();
        
        if (logsData && logsData.length > 1) {
           for (let i = logsData.length - 1; i >= 1; i--) {
              let row = logsData[i];
              if (row && row[0]) {
                 let d = new Date(row[0]);
                 let dStr = d.toLocaleString([], {month:'numeric', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit'});
                 let adminName = row[1] || '';
                 if (adminName) uniqueAdmins.add(adminName);
                 let playerName = row[2] || '';
                 let amount = row[3] || '';
                 let newTotal = row[4] !== undefined ? row[4] : '';
                 tbodyHtml += `
                   <tr class="admin-log-row" data-admin="${adminName.toLowerCase()}" style="border-bottom:1px solid var(--border);">
                     <td style="padding:10px; font-size:13px; color:var(--text-muted);">${dStr}</td>
                     <td style="padding:10px; font-weight:bold; color:var(--accent);">${adminName}</td>
                     <td style="padding:10px; font-weight:bold; color:var(--text-main);">${playerName}</td>
                     <td style="padding:10px; color:var(--text-main);">${amount}</td>
                     <td style="padding:10px; font-weight:bold; color:var(--success);">${newTotal}</td>
                   </tr>
                 `;
              }
           }
        }
        
        if (tbodyHtml === '') tbodyHtml = `<tr><td colspan="5" style="padding:15px; text-align:center; color:var(--text-muted);">No logs found.</td></tr>`;
        document.getElementById('adminLogsTableBody').innerHTML = tbodyHtml;
        
        // Populate Admin Filter Dropdown
        const adminSelect = document.getElementById('adminLogFilter');
        if (adminSelect) {
           const currentSelection = adminSelect.value;
           let selectHtml = '<option value="">All Admins</option>';
           Array.from(uniqueAdmins).sort().forEach(admin => {
              selectHtml += `<option value="${admin.toLowerCase()}">${admin}</option>`;
           });
           adminSelect.innerHTML = selectHtml;
           adminSelect.value = currentSelection || '';
        }
      });
      
      window.filterAdminLogs = () => {
         const search = document.getElementById('adminLogSearch').value.toLowerCase();
         const adminFilter = document.getElementById('adminLogFilter').value.toLowerCase();
         
         document.querySelectorAll('.admin-log-row').forEach(row => {
            const matchesSearch = row.innerText.toLowerCase().includes(search);
            const matchesAdmin = adminFilter === '' || row.getAttribute('data-admin') === adminFilter;
            
            if (matchesSearch && matchesAdmin) {
               row.style.display = '';
            } else {
               row.style.display = 'none';
            }
         });
      };
      
    } catch(err) {
      renderError(err.message);
    }
  },
  
  beartrap: async () => {
    if (!window.isAdminUser(currentUser)) {
      views.home();
      return;
    }
    
    // Fetch roster so datalist has everyone, not just registered users
    let rosterRawData = null;
    try {
      rosterRawData = await fetchSheet("Chief's List");
    } catch (e) {
      console.error("Failed to load roster for datalist", e);
    }
    
    app.innerHTML = `
      <div class="card" style="max-width:800px; margin:0 auto; animation: fadeIn 0.3s ease; position:relative;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">
          <h2 style="color:var(--accent); margin:0; display:flex; align-items:center; gap:10px;">
            🐻 Multi-BT Donations
            <button onclick="document.getElementById('btLookupModal').style.display='block'" style="background:var(--card-bg); color:var(--text-main); border:1px solid var(--accent); padding:4px 8px; border-radius:6px; cursor:pointer; font-size:12px; margin-left:10px;">🔍 Lookup</button>
          </h2>
          <button onclick="views.admin()" style="background:var(--bg-main); color:var(--text-main); border:1px solid var(--border); padding:5px 12px; border-radius:6px; cursor:pointer;">Back to Admin</button>
        </div>
        
        <!-- Quick Lookup Modal (Hidden by default) -->
        <div id="btLookupModal" style="display:none; position:absolute; top:50px; left:0; width:100%; background:var(--bg-main); padding:20px; border-radius:12px; border:1px solid var(--accent); box-shadow:0 10px 25px rgba(0,0,0,0.5); z-index:10; box-sizing:border-box;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h3 style="margin:0; color:var(--text-main); font-size:16px;">🔍 Quick Lookup</h3>
            <button onclick="document.getElementById('btLookupModal').style.display='none'" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:20px;">&times;</button>
          </div>
          <div style="display:flex; gap:10px;">
            <input type="text" id="beartrapLookup" list="chiefList" placeholder="Player Name..." style="flex:1; padding:10px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main);">
            <button onclick="window.doBeartrapLookup()" style="background:var(--accent); color:#fff; border:none; padding:0 20px; border-radius:6px; cursor:pointer; font-weight:bold;">Check</button>
          </div>
          <div id="beartrapLookupResult" style="margin-top:10px; font-weight:bold; text-align:center;"></div>
        </div>

        <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--border); margin-bottom:20px;">
          <h3 style="margin-top:0; color:var(--text-main); font-size:16px;">📝 Add Donations</h3>
          <div id="beartrapEntries">
            <div class="beartrap-row" style="display:flex; gap:10px; margin-bottom:10px;">
              <input type="text" class="bt-name" list="chiefList" placeholder="Player Name..." style="flex:2; padding:10px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main);">
              <input type="number" class="bt-amount" placeholder="Amount..." style="flex:1; padding:10px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main);">
              <button onclick="this.parentElement.remove()" style="background:var(--danger); color:#fff; border:none; width:40px; border-radius:6px; cursor:pointer; font-weight:bold;">X</button>
            </div>
          </div>
          <div style="display:flex; gap:10px; margin-top:10px;">
            <button onclick="window.addBeartrapRow()" style="background:transparent; border:1px solid var(--border); color:var(--text-main); padding:10px; border-radius:6px; cursor:pointer; flex:1;">+ Add Row</button>
            <button id="submitBeartrapBtn" onclick="window.submitBeartrapDonations()" style="background:var(--success); border:none; color:#fff; padding:10px; border-radius:6px; cursor:pointer; font-weight:bold; flex:2;">Submit All</button>
          </div>
          <div id="beartrapStatus" style="margin-top:15px; text-align:center; font-size:14px;"></div>
        </div>
        
        <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--border);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
             <h3 style="margin:0; color:var(--text-main); font-size:16px;">🕒 Admin Log</h3>
             <button onclick="window.loadBeartrapLog()" style="background:transparent; border:none; color:var(--accent); cursor:pointer; font-size:12px;">🔄 Refresh</button>
          </div>
          <div id="beartrapLog" style="max-height:200px; overflow-y:auto; font-size:13px; color:var(--text-muted);">
            Loading...
          </div>
        </div>

      </div>
      <datalist id="chiefList"></datalist>
    `;
    
    // Populate datalist from roster
    const dl = document.getElementById('chiefList');
    if (dl && rosterRawData && rosterRawData.length > 0) {
      const players = [];
      for (let i = 1; i < rosterRawData.length; i++) {
        if (rosterRawData[i][0] && rosterRawData[i][0].toString().trim() !== "") {
          players.push(rosterRawData[i][0].toString().trim());
        }
      }
      players.sort((a, b) => a.localeCompare(b));
      players.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        dl.appendChild(opt);
      });
    } else if (dl) {
      // Fallback to idToNameMap if sheet fetch failed
      Object.values(idToNameMap).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        dl.appendChild(opt);
      });
    }

    // Attach global functions to window so inline onclick can see them
    window.addBeartrapRow = () => {
      const cont = document.getElementById('beartrapEntries');
      const div = document.createElement('div');
      div.className = 'beartrap-row';
      div.style.cssText = 'display:flex; gap:10px; margin-bottom:10px;';
      div.innerHTML = `
        <input type="text" class="bt-name" list="chiefList" placeholder="Player Name..." style="flex:2; padding:10px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main);">
        <input type="number" class="bt-amount" placeholder="Amount..." style="flex:1; padding:10px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main);">
        <button onclick="this.parentElement.remove()" style="background:var(--danger); color:#fff; border:none; width:40px; border-radius:6px; cursor:pointer; font-weight:bold;">X</button>
      `;
      cont.appendChild(div);
      div.querySelector('.bt-name').focus();
    };

    window.doBeartrapLookup = async () => {
      const name = document.getElementById('beartrapLookup').value.trim();
      const resDiv = document.getElementById('beartrapLookupResult');
      if (!name) return;
      resDiv.innerHTML = '<span style="color:var(--text-muted)">Searching...</span>';
      try {
        const res = await fetch(`${API_BASE_URL}?api=lookup&name=${encodeURIComponent(name)}`).then(r => r.json());
        if (res.success) {
          resDiv.innerHTML = `<span style="color:var(--success)">${res.name} Total: ${res.total}</span>`;
        } else {
          resDiv.innerHTML = `<span style="color:var(--danger)">${res.message}</span>`;
        }
      } catch(e) {
        resDiv.innerHTML = `<span style="color:var(--danger)">Network error.</span>`;
      }
    };

    window.loadBeartrapLog = async () => {
      const logDiv = document.getElementById('beartrapLog');
      logDiv.innerHTML = '<span style="color:var(--text-muted)">Loading...</span>';
      try {
        const res = await fetch(`${API_BASE_URL}?api=adminLog`).then(r => r.json());
        if (res.success && res.data.length > 0) {
          let html = '';
          res.data.forEach(log => {
            html += `
              <div style="padding:8px 0; border-bottom:1px solid var(--border);">
                <div style="color:var(--text-main);">${log.name} <span style="color:var(--success); font-weight:bold;">+${log.amount}</span> (Total: ${log.newTotal})</div>
                <div style="font-size:11px;">${log.timestamp} • By ${log.email}</div>
              </div>
            `;
          });
          logDiv.innerHTML = html;
        } else {
          logDiv.innerHTML = '<span style="color:var(--text-muted)">No activity found.</span>';
        }
      } catch(e) {
        logDiv.innerHTML = `<span style="color:var(--danger)">Network error.</span>`;
      }
    };

    window.submitBeartrapDonations = async () => {
      const rows = document.querySelectorAll('.beartrap-row');
      const entries = [];
      rows.forEach(r => {
        const name = r.querySelector('.bt-name').value.trim();
        const amt = r.querySelector('.bt-amount').value.trim();
        if (name && amt) entries.push({name, amount: amt});
      });
      
      const statusDiv = document.getElementById('beartrapStatus');
      const submitBtn = document.getElementById('submitBeartrapBtn');
      if (entries.length === 0) {
         statusDiv.innerHTML = '<span style="color:var(--danger)">No entries to submit.</span>';
         return;
      }
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';
      statusDiv.innerHTML = `<span style="color:var(--text-muted)">Processing ${entries.length} entries...</span>`;
      
      const adminName = idToNameMap[currentUser.gameId] || "Admin";
      
      let completed = 0;
      let resultsHTML = "<div style='text-align:left; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); padding:10px; border-radius:6px; color:var(--success); font-size:13px;'><strong>Results:</strong><br>";
      
      for (const entry of entries) {
         try {
           const res = await fetch(`${API_BASE_URL}?api=addDonation&name=${encodeURIComponent(entry.name)}&amount=${encodeURIComponent(entry.amount)}&admin=${encodeURIComponent(adminName)}`).then(r => r.json());
           if (res && res.success) {
             resultsHTML += `✅ <b>${res.name}</b>: +${res.amount} (New Total: ${res.newTotal})<br>`;
           } else if (res && res.message) {
             resultsHTML += `❌ ${res.message}<br>`;
           } else {
             resultsHTML += `✅ <b>${entry.name}</b>: +${entry.amount} added.<br>`;
           }
         } catch(e) {
           resultsHTML += `❌ <b>${entry.name}</b>: Network error.<br>`;
         }
         completed++;
         statusDiv.innerHTML = `<span style="color:var(--text-muted)">Processed ${completed} of ${entries.length}...</span>`;
      }
      
      resultsHTML += "</div>";
      statusDiv.innerHTML = resultsHTML;
      
      // Reset form
      const cont = document.getElementById('beartrapEntries');
      cont.innerHTML = `
        <div class="beartrap-row" style="display:flex; gap:10px; margin-bottom:10px;">
          <input type="text" class="bt-name" list="chiefList" placeholder="Player Name..." style="flex:2; padding:10px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main);">
          <input type="number" class="bt-amount" placeholder="Amount..." style="flex:1; padding:10px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main);">
          <button onclick="this.parentElement.remove()" style="background:var(--danger); color:#fff; border:none; width:40px; border-radius:6px; cursor:pointer; font-weight:bold;">X</button>
        </div>
      `;
      
      window.loadBeartrapLog();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit All';
    };

    window.loadBeartrapLog();
  },
  
  account: async () => {
    if (!currentUser) {
      views.home();
      return;
    }
    
          let linkedHtml = '';
      let links = currentUser.linkedGameIds || [];
      if (links.length > 0) {
          linkedHtml += `<div style="text-align:left; border-top:1px solid var(--border); padding-top:20px; margin-top:20px;">
            <h3 style="margin-top:0; color:var(--text-main); font-size:16px;">s< Linked Alt Accounts</h3>
            <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px;">`;
            
          links.forEach(gid => {
              let altName = idToNameMap[gid] || `Game ID: ${gid}`;
              linkedHtml += `<div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-main); padding:10px 15px; border-radius:8px; border:1px solid var(--border);">
                  <div style="display:flex; align-items:center; gap:10px;">
                      <div style="width:30px; height:30px; border-radius:50%; background:var(--accent); color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; overflow:hidden;">
                          <img src="${avatarMap[gid] || `images/${altName}.png`}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
                          <div style="display:none; align-items:center; justify-content:center; width:100%; height:100%;">${altName.charAt(0).toUpperCase()}</div>
                      </div>
                      <div style="text-align:left;">
                          <div style="font-weight:bold; font-size:14px; color:var(--text-main);">${altName}</div>
                          <div style="font-size:11px; color:var(--text-muted);">${gid}</div>
                      </div>
                  </div>
                  <button onclick="window.unlinkAltAccountPrompt('${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:12px;">Unlink</button>
              </div>`;
          });
          
          linkedHtml += `</div>`;
          if (links.length < 2) {
              linkedHtml += `<button onclick="window.linkAltAccountPrompt()" style="background:rgba(52,152,219,0.1); color:var(--accent); border:1px dashed var(--accent); padding:10px; border-radius:8px; cursor:pointer; font-weight:bold; width:100%; transition:0.2s;" onmouseover="this.style.background='rgba(52,152,219,0.2)'" onmouseout="this.style.background='rgba(52,152,219,0.1)'">+ Link Another Account</button>`;
          }
          linkedHtml += `</div>`;
      } else {
          linkedHtml += `<div style="text-align:left; border-top:1px solid var(--border); padding-top:20px; margin-top:20px;">
            <h3 style="margin-top:0; color:var(--text-main); font-size:16px;">s< Linked Alt Accounts</h3>
            <p style="color:var(--text-muted); font-size:13px; margin-bottom:15px;">You can link up to 2 alt accounts to bypass the unregistered filter.</p>
            <button onclick="window.linkAltAccountPrompt()" style="background:rgba(52,152,219,0.1); color:var(--accent); border:1px dashed var(--accent); padding:10px; border-radius:8px; cursor:pointer; font-weight:bold; width:100%; transition:0.2s;" onmouseover="this.style.background='rgba(52,152,219,0.2)'" onmouseout="this.style.background='rgba(52,152,219,0.1)'">+ Link Alt Account</button>
          </div>`;
      }
      
      let currentChiefName = idToNameMap[currentUser.gameId] || `Game ID: ${currentUser.gameId}`;
    
    app.innerHTML = `
      <div id="accountHubView" class="card" style="max-width:600px; margin:0 auto; text-align:center;">
        <h2 style="color:var(--text-main); margin-top:0;">Account Hub</h2>
        <div style="background:var(--bg-main); padding:20px; border-radius:12px; border:1px solid var(--border); margin-bottom:20px;">
          <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:10px;">
            <div style="width:80px; height:80px; border-radius:50%; background:var(--accent); color:#fff; display:flex; align-items:center; justify-content:center; font-size:32px; font-weight:bold; margin-bottom:10px; overflow:hidden; border:2px solid var(--border);">
              <img id="accountHubAvatarImg" src="${avatarMap[currentUser.gameId] || `images/${currentChiefName}.png`}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div style="display:none; align-items:center; justify-content:center; width:100%; height:100%;">${currentChiefName.charAt(0).toUpperCase()}</div>
            </div>
            <div style="font-size:18px; font-weight:bold; color:var(--accent);">${currentChiefName}</div>
          </div>
          <div style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">${currentUser.email}</div>
          
          <div style="text-align:left; border-top:1px solid var(--border); padding-top:20px; margin-top:20px;">
            <h3 style="margin-top:0; color:var(--text-main); font-size:16px;">🖼️ Profile Picture</h3>
            <p style="color:var(--text-muted); font-size:13px; margin-bottom:15px;">Upload a custom profile picture. It will automatically replace your default avatar on the Chief's Roster and Leaderboards.</p>
            
            <input type="file" id="avatarUploadInput" accept="image/png, image/jpeg, image/webp" style="display:none;">
            <button id="avatarUploadBtn" style="background:var(--bg-main); border:1px solid var(--accent); color:var(--text-main); padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold; transition:0.2s;">Choose Image</button>
            
            <div id="avatarUploadStatus" style="margin-top:10px; font-size:13px; color:var(--success); font-weight:bold;"></div>
          </div>
        </div>
            ${linkedHtml}
        
        <button id="logoutBtn" style="background:transparent; border:1px solid var(--danger); color:var(--danger); padding:8px 16px; border-radius:8px; cursor:pointer; font-weight:bold;">Sign Out</button>
      </div>
    `;
    
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await logoutUser();
      window.showToast("Signed out successfully.", "success");
      views.home();
    });
    
    const uploadInput = document.getElementById('avatarUploadInput');
    const uploadBtn = document.getElementById('avatarUploadBtn');
    const statusMsg = document.getElementById('avatarUploadStatus');
    
    uploadBtn.addEventListener('click', () => uploadInput.click());
    
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Basic size check (optional but good practice to prevent massive uploads crashing browser)
      if (file.size > 10 * 1024 * 1024) { // 10MB
          window.showToast("Image too large. Max 10MB.", "error");
          return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        // Minimum size check logic
        const img = new Image();
        img.onload = () => {
           if (img.width < 100 || img.height < 100) {
               window.showToast("Image must be at least 100x100 pixels.", "error");
               return;
           }
           
           // Show Modal
           const modal = document.getElementById('cropperModal');
           const cropperImage = document.getElementById('cropperImage');
           const cancelBtn = document.getElementById('cropperCancelBtn');
           const saveBtn = document.getElementById('cropperSaveBtn');
           
           cropperImage.src = event.target.result;
           modal.style.display = 'flex';
           
           // Initialize Cropper
           let cropper = new Cropper(cropperImage, {
               aspectRatio: 1,
               viewMode: 1,
               preview: '.img-preview',
               dragMode: 'move',
               autoCropArea: 1,
               restore: false,
               guides: false,
               center: false,
               highlight: false,
               cropBoxMovable: true,
               cropBoxResizable: true,
               toggleDragModeOnDblclick: false,
           });
           
           // Cancel Event
           cancelBtn.onclick = () => {
               cropper.destroy();
               modal.style.display = 'none';
               uploadInput.value = '';
           };
           
           // Save Event
           saveBtn.onclick = async () => {
               uploadBtn.textContent = 'Uploading...';
               uploadBtn.disabled = true;
               saveBtn.textContent = 'Saving...';
               saveBtn.disabled = true;
               
               // Get perfectly cropped 150x150 canvas
               const canvas = cropper.getCroppedCanvas({
                   width: 150,
                   height: 150,
                   imageSmoothingEnabled: true,
                   imageSmoothingQuality: 'high'
               });
               
               // Compress to JPEG
               const base64String = canvas.toDataURL('image/jpeg', 0.8);
               
               try {
                   await uploadAvatar(currentUser.gameId, base64String);
                   
                   // Update DOM immediately
                   const imgEl = document.getElementById('accountHubAvatarImg');
                   if (imgEl) {
                     imgEl.src = base64String;
                     imgEl.style.display = 'block';
                     if (imgEl.nextElementSibling) imgEl.nextElementSibling.style.display = 'none';
                   }
                   
                   statusMsg.style.color = 'var(--success)';
                   statusMsg.textContent = '✅ Profile picture updated successfully!';
                   
                   // Refresh mapping so UI updates immediately globally
                   if (idToNameMap[currentUser.gameId]) {
                      avatarMap[currentUser.gameId] = await get(ref(db, `avatars/${currentUser.gameId}`)).then(s => s.val());
                   }
               } catch (err) {
                   console.error(err);
                   statusMsg.style.color = 'var(--danger)';
                   statusMsg.textContent = '❌ Upload failed. Please try again.';
               }
               
               // Cleanup
               cropper.destroy();
               modal.style.display = 'none';
               uploadInput.value = '';
               uploadBtn.textContent = 'Choose Image';
               uploadBtn.disabled = false;
               saveBtn.textContent = 'Save';
               saveBtn.disabled = false;
           };
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

  },

  home: async () => {
    renderLoading('Loading Home & News');
    try {
      const data = await fetchSheet('News');
      
      let scheduleData = null;
      try {
        scheduleData = await fetchSheet('WhiteOut Survival');
      } catch(e) { console.error('Failed to load schedule for countdown', e); }
      
      let nextEvents = [];
      let nextEventTime = null;
      
      if (scheduleData && Array.isArray(scheduleData) && scheduleData.length > 0) {
        let upcomingEvents = [];
        let now = new Date();
        
        for (let i = 1; i < Math.min(34, scheduleData.length); i++) {
          let row = scheduleData[i];
          let eventName = row[5];
          let originalDateVal = row[6];
          let utcVal = row[7];
          
          if (!eventName || eventName.toString().trim() === "" || eventName.includes("Event's")) continue;
          if (typeof originalDateVal !== 'string' || !originalDateVal.match(/^\d{4}-\d{2}-\d{2}T/)) continue;
          if (typeof utcVal !== 'string' || !utcVal.match(/^\d{4}-\d{2}-\d{2}T/)) continue;
          
          let eventDate = new Date(originalDateVal);
          let gasDate = new Date(utcVal);
          gasDate.setUTCHours(gasDate.getUTCHours() - 8); // Undo Google Sheets time offset
          
          // Combine Date and Time into a single exact Date object
          let exactEventDate = new Date(eventDate);
          exactEventDate.setUTCHours(gasDate.getUTCHours(), gasDate.getUTCMinutes(), 0, 0);
          
          if (exactEventDate > now) {
            upcomingEvents.push({
              name: eventName,
              exactDate: exactEventDate
            });
          }
        }
        
        // Sort by closest date
        if (upcomingEvents.length > 0) {
          upcomingEvents.sort((a, b) => a.exactDate - b.exactDate);
          
          // Get the very next time slot
          nextEventTime = upcomingEvents[0].exactDate;
          
          // Get ALL events that happen at that exact same time
          nextEvents = upcomingEvents.filter(e => e.exactDate.getTime() === nextEventTime.getTime());
        }
      }
      
      const renderNewsContent = () => {
        let contentHtml = "";
        
        // Data starts at Row 4 (index 3) and Column C (index 2)
        const newsItems = [];
        if (data && data.length > 3) {
          for (let i = 3; i < data.length; i++) {
            let text = data[i][2]; // Column C
            if (text && text.toString().trim() !== "") {
              // Format Google Forms links as a nice "Sign-up" button
              let formattedText = text.toString().replace(
                /(https:\/\/docs\.google\.com\/forms[^\s]+|https:\/\/forms\.gle\/[^\s]+)/g, 
                '<a href="$1" target="_blank" style="display:inline-block; margin-top:10px; background:var(--accent); color:#fff; padding:8px 16px; border-radius:20px; text-decoration:none; font-weight:bold; font-size:14px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">🎁 Sign-up for Auto Redeem Gift Codes</a>'
              );
              
              // Format any other standard links normally
              formattedText = formattedText.replace(
                /(?<!href=")(https?:\/\/[^\s]+)/g, 
                '<a href="$1" target="_blank" style="color:var(--accent); text-decoration:underline; word-break:break-all;">$1</a>'
              );
              
              newsItems.push(formattedText);
            }
          }
        }
        
        if(newsItems.length === 0) {
          contentHtml = `<div class="loading">No news found.</div>`;
        } else {
          contentHtml += `<table style="table-layout:fixed; width:100%;"><thead><tr><th>Announcement</th></tr></thead><tbody>`;
          for(let i=0; i<newsItems.length; i++){
            contentHtml += `<tr><td style="white-space:normal; word-wrap:break-word;">${newsItems[i]}</td></tr>`;
          }
          contentHtml += `</tbody></table>`;
        }
        return contentHtml;
      };

      let countdownHtml = '';
      if (nextEvents.length > 0) {
        countdownHtml = `
          <div class="card" style="margin-bottom: 25px; position: relative; overflow: hidden; animation: fadeIn 0.5s ease;">
            <div class="countdown-widget-container" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
              <div class="countdown-event-details" style="display:flex; align-items:center; gap:15px;">
                <div style="background:rgba(168,85,247,0.1); color:var(--accent); width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0;">
                  ⏱️
                </div>
                <div>
                  <div style="font-weight:bold; color:var(--text-muted); font-size:12px; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Next Upcoming Event</div>
                  <div id="liveCountdownEventName" style="font-weight:bold; color:var(--text-main); font-size:18px; transition: opacity 0.3s ease;">
                    ${nextEvents[0].name.includes('Bear Trap') ? '🪤' : '✨'} ${nextEvents[0].name}
                  </div>
                </div>
              </div>
              <div class="countdown-timer-details" style="text-align:right;">
                <div style="font-weight:bold; color:var(--text-muted); font-size:12px; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Starts In</div>
                <div id="liveCountdownTimer" style="font-weight:bold; color:var(--accent); font-size:24px; font-family:monospace; background:var(--bg-main); padding:6px 12px; border-radius:8px; border:1px solid var(--border);">
                  --h --m --s
                </div>
              </div>
            </div>
          </div>
        `;
      }

      let headerHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h2 style="margin:0; color:var(--text-main); font-size:24px;">📰 Alliance News</h2>
        </div>
      `;
      
      app.innerHTML = countdownHtml + headerHtml + `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; flex-wrap:wrap; gap:15px; border-bottom:1px solid var(--border); padding-bottom:15px;">
            <div class="card-title" style="margin:0;">Recent Updates</div>
          </div>
          <div id="newsContentContainer">
            ${renderNewsContent()}
          </div>
        </div>
      `;

      if (nextEvents.length > 0 && nextEventTime) {
        // Rotation Interval
        let eventIdx = 0;
        let eventNameEl = document.getElementById('liveCountdownEventName');
        if (nextEvents.length > 1) {
          const rotationInterval = setInterval(() => {
            if (!document.getElementById('liveCountdownEventName')) return clearInterval(rotationInterval);
            eventIdx = (eventIdx + 1) % nextEvents.length;
            let evName = nextEvents[eventIdx].name;
            eventNameEl.style.opacity = 0;
            setTimeout(() => {
              if (!document.getElementById('liveCountdownEventName')) return;
              eventNameEl.innerHTML = `${evName.includes('Bear Trap') ? '🪤' : '✨'} ${evName}`;
              eventNameEl.style.opacity = 1;
            }, 300);
          }, 4000); // Rotate every 4 seconds
        }

        // Countdown Interval
        const timerEl = document.getElementById('liveCountdownTimer');
        const updateTimer = () => {
          if (!document.getElementById('liveCountdownTimer')) return clearInterval(countdownInterval);
          let now = new Date();
          let diff = nextEventTime - now;
          
          if (diff <= 0) {
            timerEl.innerHTML = "Started!";
            timerEl.style.color = "var(--success)";
            clearInterval(countdownInterval);
            // Refresh view to get the next event
            setTimeout(() => {
              if (document.getElementById('liveCountdownTimer')) views.home();
            }, 5000);
            return;
          }
          
          let h = Math.floor(diff / (1000 * 60 * 60));
          let m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          let s = Math.floor((diff % (1000 * 60)) / 1000);
          
          timerEl.innerHTML = `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
        };
        
        let countdownInterval = setInterval(updateTimer, 1000);
        updateTimer();
      }
      
    } catch(e) { renderError(e.message); }
  },
  


  leaderboards: async (filterString) => {
    renderLoading("Loading Leaderboards");
    try {
      const data = await fetchSheet("LeaderBoards");
      let html = ``;
      
      let boards = [];
      for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[r].length; c++) {
          let cell = data[r][c];
          if (typeof cell === 'string' && (cell.toLowerCase().includes('leaderboard') || cell.toLowerCase().includes('all-time bear donations'))) {
            let title = cell;
            let headers = [];
            let hc = c;
            
            // Read headers on the next row
            if (r + 1 < data.length) {
              while (hc < data[r+1].length && data[r+1][hc] !== "") {
                headers.push(data[r+1][hc]);
                hc++;
              }
            }
            
            // Read data rows starting from 2 rows down
            let rows = [];
            let dr = r + 2;
            while (dr < data.length && data[dr][c] !== "") {
              let rowData = [];
              let hasPlayerData = false;
              
              for (let i = 0; i < headers.length; i++) {
                let cellVal = data[dr][c + i];
                rowData.push(cellVal);
                // Check if any column OTHER than Rank has actual data
                if (i > 0 && cellVal !== "") {
                  hasPlayerData = true;
                }
              }
              
              if (hasPlayerData) {
                rows.push(rowData);
              }
              dr++;
            }
            
            if (headers.length > 0) {
              // Only add if it matches the filter, or if no filter is active
              if (!filterString || title.toLowerCase().includes(filterString.toLowerCase())) {
                boards.push({ title, headers, rows });
              }
            }
          }
        }
      }

      // Fetch champions config once
      let btWinners = {};
      try {
         const snap = await get(ref(db, 'config/bearTrapWinners'));
         if (snap.exists()) {
            btWinners = snap.val();
         }
      } catch (e) {
         console.warn("Could not fetch bt winners", e);
      }

      html += `<div style="display:flex; flex-wrap:wrap; gap:20px;">`;
      
      boards.forEach(board => {
        html += `<div class="card" style="flex: 1; min-width: 320px;"><div class="card-title">🏆 ${board.title}</div>`;
        
        // Champion Banner Logic
        let trapNum = null;
        let isAllTime = false;
        if (board.title.toLowerCase().includes('bear trap 1')) trapNum = '1';
        else if (board.title.toLowerCase().includes('bear trap 2')) trapNum = '2';
        else if (board.title.toLowerCase().includes('all-time bear trap')) isAllTime = true;
        
        let champName = null;
        let champScore = null;
        let bannerTitle = "👑 Reigning Champion";
        
        if (trapNum && btWinners[trapNum]) {
           champName = btWinners[trapNum].name;
           champScore = btWinners[trapNum].score;
        } else if (isAllTime && board.rows.length > 0) {
           let firstRow = board.rows[0];
           champName = firstRow[1] ? firstRow[1].toString() : null;
           champScore = firstRow[2] !== undefined ? firstRow[2] : null;
           bannerTitle = "👑 All-Time Champion";
        }
        
        if (champName) {
           // Look up their gameId to get the avatar
           let champId = null;
           for (const [gid, name] of Object.entries(idToNameMap)) {
               if (name.toLowerCase() === champName.toLowerCase()) {
                   champId = gid; break;
               }
           }
           
           const avatarSrc = (champId && avatarMap[champId]) ? avatarMap[champId] : `images/${champName}.png`;
           
           html += `
             <div style="background: linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.02) 100%); border: 1px solid rgba(255,215,0,0.3); border-radius: 12px; padding: 15px; margin-bottom: 20px; display: flex; align-items: center; gap: 15px; box-shadow: 0 4px 15px rgba(255,215,0,0.05);">
               <div style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #FFD700; overflow: hidden; flex-shrink: 0; box-shadow: 0 0 10px rgba(255,215,0,0.2);">
                 <img src="${avatarSrc}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.src='images/default.png';">
               </div>
               <div style="flex: 1;">
                 <div style="color: #FFD700; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">${bannerTitle}</div>
                 <div style="color: var(--text-main); font-size: 18px; font-weight: bold;">${champName}</div>
               </div>
               <div style="text-align: right;">
                 <div style="color: var(--text-muted); font-size: 11px;">Total Wins</div>
                 <div style="color: var(--accent); font-size: 20px; font-weight: bold;">${champScore}</div>
               </div>
             </div>
           `;
        }
        html += `<div style="overflow-x: auto; width: 100%;"><table style="min-width: max-content;"><thead><tr>`;
        board.headers.forEach(h => html += `<th>${h}</th>`);
        html += `</tr></thead><tbody>`;
        
        board.rows.forEach(row => {
          html += `<tr>`;
          row.forEach((cell, idx) => {
            if (typeof cell === 'number') {
              if (idx === 0) {
                 if (cell === 1) cell = '🥇 1';
                 else if (cell === 2) cell = '🥈 2';
                 else if (cell === 3) cell = '🥉 3';
              } else {
                 cell = cell.toLocaleString();
              }
            }
            // Ensure strings that look like numbers are also formatted, but carefully
            else if (typeof cell === 'string' && !isNaN(cell) && cell.trim() !== "" && idx > 0) {
              cell = Number(cell).toLocaleString();
            }
            
            let formattedCell = formatCell(cell);
            
            html += `<td ${idx === 0 ? 'style="font-weight:bold; color:var(--text-muted);"' : ''}>${formattedCell}</td>`;
          });
          html += `</tr>`;
        });
        
        if (board.title.toLowerCase().includes('bear donations')) {
           // We'll append the widget placeholder specifically under the Bear Donations board
           html += `<div id="bearTrapActivityWidget-${board.title.replace(/\s+/g, '')}" class="bear-trap-activity-widget" style="margin-top: 15px;"></div>`;
        }
        
        html += `</tbody></table></div></div>`;
      });
      
      html += `</div>`;
      app.innerHTML = html;
      
      // Initialize Firebase Listeners for any Bear Trap widgets rendered
      document.querySelectorAll('.bear-trap-activity-widget').forEach(widget => {
        widget.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:12px; padding:10px;">Loading today's activity...</div>`;
        
        const logRef = ref(db, 'bearTrapLog');
        onValue(logRef, (snapshot) => {
          if (!document.contains(widget)) return; // Exit if user navigated away
          
          let logs = snapshot.val();
          if (!logs || !Array.isArray(logs)) {
             widget.innerHTML = '';
             return;
          }
          
          const todayStr = new Date().toDateString();
          let todaysLogs = logs.filter(log => new Date(log.timestamp).toDateString() === todayStr);
          
          if (todaysLogs.length === 0) {
             widget.innerHTML = '';
             return;
          }
          
          todaysLogs.reverse(); // Newest first
          
          let logHtml = `<div style="background:var(--bg-main); border:1px solid var(--border); border-radius:8px; overflow:hidden;">
            <button onclick="this.nextElementSibling.classList.toggle('hidden')" style="width:100%; background:transparent; border:none; padding:12px 15px; color:var(--text-main); font-weight:bold; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
              <span>📅 View Today's Activity (${todaysLogs.length} Update${todaysLogs.length > 1 ? 's' : ''})</span>
              <span style="color:var(--text-muted);">▼</span>
            </button>
            <div class="hidden" style="padding:0 15px 15px 15px; border-top:1px solid var(--border);">
              <ul style="list-style:none; padding:0; margin:0; margin-top:10px;">`;
              
          todaysLogs.forEach(log => {
             let d = new Date(log.timestamp);
             let timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
             logHtml += `<li style="padding:8px 0; border-bottom:1px dashed var(--border); font-size:13px; color:var(--text-muted);">
                <span style="color:var(--accent); font-weight:bold;">${timeStr}</span>: 
                <span style="color:var(--text-main); font-weight:bold;">${log.name}</span> donated 
                <span style="color:var(--success); font-weight:bold;">+${log.amount}</span> trap${log.amount !== 1 ? 's' : ''}
             </li>`;
          });
          
          logHtml += `</ul></div></div>`;
          widget.innerHTML = logHtml;
        });
      });
      
    } catch(e) { renderError(e.message); }
  },

  
  showdown: async () => {
    renderLoading("Loading Showdown Data");
    try {
      const data = await fetchSheet("Showdown");
      let html = `<div style="display:flex; flex-direction:column; gap:20px;">`;
      
      let goalsCard = '';
      let allianceCard = '';
      let playersCard = '';
      
      let totalAllianceScore = 0;
      for (let r = 0; r < data.length; r++) {
        let row = data[r];
        if (row.some(c => typeof c === 'string' && c.toLowerCase().includes("alliance's"))) {
          let startCol = row.findIndex(c => typeof c === 'string' && c.toLowerCase().includes("alliance's"));
          if (r + 2 < data.length) {
            let ourRow = data[r+2];
            let val = ourRow[startCol + 8];
            if (val !== undefined && val !== null) {
               totalAllianceScore = Number(val.toString().replace(/,/g, '')) || 0;
            }
          }
          break;
        }
      }
      
      const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
      };
      
      for (let r = 0; r < data.length; r++) {
        let row = data[r];
        
        // 1. Find Alliance Showdown block (Daily Goals)
        if (row.some(c => typeof c === 'string' && c.toLowerCase().includes('allience showdown'))) {
          let startCol = row.findIndex(c => typeof c === 'string' && c.toLowerCase().includes('allience showdown'));
          
          let allTimeGoal = 20000000;
          let allTimeProgress = Math.min(100, (totalAllianceScore / allTimeGoal) * 100);
          
          goalsCard += `<div class="card" style="margin-bottom:20px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
            <h3 style="margin-top:0; color:var(--text-main); font-size:20px; margin-bottom:20px;">🏆 Alliance Showdown Progress</h3>
            
            <div style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px dashed var(--border);">
              <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:bold; margin-bottom:8px;">
                <span style="color:var(--text-main);">🌟 The 20M Challenge</span>
                <span style="color:var(--text-muted);">${formatNumber(totalAllianceScore)} / <span style="color:var(--accent);">${formatNumber(allTimeGoal)}</span></span>
              </div>
              <div style="width:100%; height:12px; background:rgba(0,0,0,0.3); border-radius:6px; overflow:hidden; border:1px solid var(--border);">
                <div style="width:${allTimeProgress}%; height:100%; background:linear-gradient(90deg, #8b5cf6, #d946ef); border-radius:6px; transition:width 1.5s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:0 0 10px #d946ef;"></div>
              </div>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:16px;">`;
          
          for (let i = 1; i <= 6; i++) {
            if (r + i < data.length) {
              let dRow = data[r + i];
              let eventDay = dRow[startCol] || "";
              if (!eventDay) break;
              
              let goal = Number(dRow[startCol + 2]) || 0; // Index 8 (Daily Goal)
              let dailyAmt = Number(dRow[startCol + 5]) || 0; // Index 11 (Daily Amount)
              
              let progress = goal > 0 ? Math.min(100, (dailyAmt / goal) * 100) : 0;
              
              goalsCard += `
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:bold; margin-bottom:6px;">
                    <span style="color:var(--text-main);">${eventDay}</span>
                    <span style="color:var(--text-muted);">${formatNumber(dailyAmt)} / <span style="color:var(--accent);">${formatNumber(goal)}</span></span>
                  </div>
                  <div style="width:100%; height:8px; background:rgba(0,0,0,0.2); border-radius:4px; overflow:hidden; border:1px solid var(--border);">
                    <div style="width:${progress}%; height:100%; background:var(--accent); border-radius:4px; transition:width 1.5s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:0 0 10px var(--accent);"></div>
                  </div>
                </div>`;
            }
          }
          goalsCard += `</div></div>`;
        }
        
        // 2. Find Alliance's Horns/Scores
        if (row.some(c => typeof c === 'string' && c.toLowerCase().includes("alliance's"))) {
          let startCol = row.findIndex(c => typeof c === 'string' && c.toLowerCase().includes("alliance's"));
          allianceCard += `<div class="card" style="overflow-x:auto;"><div class="card-title">🛡️ Alliance Progress</div><table><thead><tr>`;
          
          for (let c = startCol; c <= startCol + 8; c++) {
            allianceCard += `<th>${row[c] || ""}</th>`;
          }
          allianceCard += `</tr></thead><tbody>`;
          
          // Grab the next 4 rows: Enemy, Our Alliance, Horns, Winners
          for (let i = 1; i <= 4; i++) {
            if (r + i < data.length) {
              let aRow = data[r + i];
              allianceCard += `<tr>`;
              for (let c = startCol; c <= startCol + 8; c++) {
                let val = aRow[c];
                
                // If it's the first row (Enemy) and the name is missing, provide a placeholder
                if (i === 1 && c === startCol && (!val || val.toString().trim() === "")) {
                  val = "Enemy Alliance";
                }
                
                if (typeof val === 'number') val = val.toLocaleString();
                
                let styleStr = c === startCol ? "font-weight:bold;" : "";
                
                // Win/Loss Calculation for Days 1-6 and Total (Cols startCol+3 to startCol+8)
                if (c >= startCol + 3 && c <= startCol + 8) {
                  let enemyRow = r + 1 < data.length ? data[r+1] : null;
                  let ourRow = r + 2 < data.length ? data[r+2] : null;
                  
                  if (enemyRow && ourRow) {
                    // Extract raw numeric values (remove commas if they exist, though they are usually pure numbers from API)
                    let eScore = Number(enemyRow[c].toString().replace(/,/g, '')) || 0;
                    let oScore = Number(ourRow[c].toString().replace(/,/g, '')) || 0;
                    
                    if (eScore > 0 || oScore > 0) {
                      if (oScore > eScore) {
                        styleStr += " background:rgba(16,185,129,0.15);"; // Green tint
                        if (i === 2 || i === 4) styleStr += " color:#10b981; font-weight:bold;"; // Highlight Our Score and Winners
                      } else if (oScore < eScore) {
                        styleStr += " background:rgba(239,68,68,0.15);"; // Red tint
                        if (i === 2 || i === 4) styleStr += " color:#ef4444; font-weight:bold;"; // Highlight Our Score and Winners
                      }
                    }
                  }
                }
                
                allianceCard += `<td style="${styleStr}">${val !== undefined && val !== "" ? val : ""}</td>`;
              }
              allianceCard += `</tr>`;
            }
          }
          allianceCard += `</tbody></table></div>`;
        }
        
        // 3. Find Player Ranking
        if (row.some(c => typeof c === 'string' && c.toLowerCase().includes("ranking"))) {
          let startCol = row.findIndex(c => typeof c === 'string' && c.toLowerCase().includes("ranking"));
          playersCard += `<div class="card" style="overflow-x:auto;"><div class="card-title">🏆 Player Rankings</div><table><thead><tr>`;
          
          for (let c = startCol; c <= startCol + 8; c++) {
            playersCard += `<th>${row[c] || ""}</th>`;
          }
          playersCard += `</tr></thead><tbody>`;
          
          let pr = r + 1;
          while (pr < data.length) {
            let pRow = data[pr];
            let member = pRow[startCol + 1];
            
            // Stop parsing if we hit an empty row or the discord templates
            if (pRow.every(cell => cell === "") || (typeof member === 'string' && member.includes("Showdown Update"))) {
              break;
            }
            
            playersCard += `<tr>`;
            for (let c = startCol; c <= startCol + 8; c++) {
              let val = pRow[c];
              
              if (c === startCol && typeof val === 'number') {
                if (val === 1) val = '🥇 1';
                else if (val === 2) val = '🥈 2';
                else if (val === 3) val = '🥉 3';
              } else if (typeof val === 'number') {
                val = val.toLocaleString();
              }
              
              playersCard += `<td ${c===startCol || c===startCol+1 ? 'style="font-weight:bold; color:var(--text-muted);"' : ''}>${formatCell(val)}</td>`;
            }
            playersCard += `</tr>`;
            pr++;
          }
          playersCard += `</tbody></table></div>`;
        }
      }
      
      if (!goalsCard && !allianceCard && !playersCard) {
        html += `<div class="card"><div class="loading" style="color:var(--danger);">Could not parse Showdown layout. Check Spreadsheet formatting.</div></div>`;
      } else {
        html += goalsCard + allianceCard + playersCard;
      }
      
      html += `</div>`;
      app.innerHTML = html;
    } catch(e) { renderError(e.message); }
  },
  
  roster: async () => {
    renderLoading("Loading Player Lookup");
    try {
      const [data, rosterRawData, lbRawData, sdHistoryRawData, sdCurrentRawData] = await Promise.all([
            fetchSheet("activity "),
            fetchSheet("Chief's List"),
            fetchSheet("LeaderBoards"),
            fetchSheet("Showdown History"),
            fetchSheet("Showdown")
          ]);
        
        let usersSnap = null;
        try { usersSnap = await get(ref(db, 'users')); } catch(e) { console.warn("Could not fetch users:", e); }
      
      if (!data || data.length < 2) throw new Error("No data found.");
      
      // Parse roster data into a lookup map (Col A -> { giftCodes: Col C, timeActive: Col E })
      const rosterMap = {};
      if (rosterRawData && rosterRawData.length > 0) {
        for (let i = 1; i < rosterRawData.length; i++) {
          let name = rosterRawData[i][0];
          if (name) {
            rosterMap[name.toString().trim()] = {
              giftCodes: rosterRawData[i][2], // Col C
              timeActive: rosterRawData[i][4] // Col E
            };
          }
        }
      }
      
      // Parse Leaderboards data into a lookup map (Name -> [{title, score, emoji}])
      const lbMap = {};
      if (lbRawData) {
        for (let r = 0; r < lbRawData.length; r++) {
          for (let c = 0; c < lbRawData[r].length; c++) {
            let cell = lbRawData[r][c];
            if (typeof cell === 'string' && (cell.toLowerCase().includes('leaderboard') || cell.toLowerCase().includes('all-time bear donations'))) {
              let title = cell.replace(/leaderboard/i, '').trim();
              let emoji = "🏆";
              if (title.toLowerCase().includes("bear")) emoji = "🐻";
              else if (title.toLowerCase().includes("showdown")) emoji = "⚔️";
              
              // Find the primary score column by scanning the headers (the last column of the table)
              let scoreCol = c + 2; // Default fallback
              if (r + 1 < lbRawData.length) {
                let hc = c;
                while (hc < lbRawData[r+1].length && lbRawData[r+1][hc] !== "") {
                  scoreCol = hc;
                  hc++;
                }
              }
              
              let dr = r + 2;
              while (dr < lbRawData.length && lbRawData[dr][c] !== "") {
                let pRank = lbRawData[dr][c];     // Column 1 is Rank
                let pName = lbRawData[dr][c + 1]; // Column 2 is Name
                let pScore = lbRawData[dr][scoreCol]; // The intelligently detected score column
                
                if (pName && pScore) {
                  let safeName = pName.toString().trim();
                  
                  // Format score if it's a number
                  if (typeof pScore === 'number') {
                     pScore = pScore.toLocaleString();
                  } else if (typeof pScore === 'string' && !isNaN(pScore) && pScore.trim() !== "") {
                     pScore = Number(pScore).toLocaleString();
                  }
                  
                  if (!lbMap[safeName]) lbMap[safeName] = [];
                  lbMap[safeName].push({ title, score: pScore, rank: pRank, emoji });
                }
                dr++;
              }
            }
          }
        }
      }
      
      // Parse dynamic All-Time Showdown totals from history and current showdown
      const allTimeShowdownMap = {};
      
      const processShowdownTable = (tableData) => {
        if (!tableData) return;
        for (let r = 0; r < tableData.length; r++) {
          let row = tableData[r];
          // Find the Ranking/Name header row
          if (row.some(c => typeof c === 'string' && c.toLowerCase().trim() === 'ranking')) {
            let nameCol = row.findIndex(c => typeof c === 'string' && (c.toLowerCase().includes('name') || c.toLowerCase().includes('member') || c.toLowerCase().includes('player')));
            let totalCol = row.findIndex(c => typeof c === 'string' && (c.toLowerCase().includes('total')));
            
            if (nameCol !== -1 && totalCol !== -1) {
              let dr = r + 1;
              // Skip horns/winners rows if they exist
              while (dr < tableData.length && tableData[dr][nameCol] && (tableData[dr][nameCol].toString().toLowerCase().includes('horns') || tableData[dr][nameCol].toString().toLowerCase().includes('winners'))) {
                dr++;
              }
              
              // Process player scores
              while (dr < tableData.length && tableData[dr][nameCol] !== undefined && tableData[dr][nameCol] !== "") {
                let pName = tableData[dr][nameCol];
                let pScore = tableData[dr][totalCol];
                
                if (pName && (typeof pScore === 'number' || (typeof pScore === 'string' && !isNaN(pScore)))) {
                  let safeName = pName.toString().trim();
                  if (!allTimeShowdownMap[safeName]) allTimeShowdownMap[safeName] = 0;
                  allTimeShowdownMap[safeName] += Number(pScore);
                }
                dr++;
              }
            }
          }
        }
      };
      
      processShowdownTable(sdHistoryRawData);
      processShowdownTable(sdCurrentRawData);
      
      // Calculate All-Time Showdown Rankings
      const allTimeRankingsMap = {};
      const sortedShowdownPlayers = Object.entries(allTimeShowdownMap)
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score - a.score);
        
      sortedShowdownPlayers.forEach((p, index) => {
        allTimeRankingsMap[p.name] = {
          score: p.score,
          rank: index + 1
        };
      });
      const headers = data[0];
      
      // Determine if a column is an upcoming/unscheduled event (no one has a 'true' value)
      // Determine if Showdown is active (at least one person has missed a day)
      let showdownActive = false;
      for (let r = 1; r < data.length; r++) {
        if (!data[r]) continue;
        let missed = data[r][1];
        if (missed !== undefined && missed !== null && missed.toString().trim() !== "" && missed !== 0 && missed !== "0") {
          showdownActive = true;
          break;
        }
      }
      
      const colIsUpcoming = {};
      for (let c = 1; c < headers.length; c++) {
        let hasAnyTrue = false;
        for (let r = 1; r < data.length; r++) {
          if (!data[r]) continue;
          let val = data[r][c];
          if (val === true || (typeof val === 'string' && (val.toLowerCase().trim() === 'true' || val === '✓' || val.toLowerCase().trim() === 'yes' || val === '✅'))) {
            hasAnyTrue = true;
            break;
          }
        }
        colIsUpcoming[c] = !hasAnyTrue;
      }
      
      const players = [];
      // Start from index 1 to skip header
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] && data[i][0].toString().trim() !== "") {
          players.push(data[i]);
        }
      }
      
      // Sort players alphabetically for the dropdown
        players.sort((a, b) => a[0].toString().localeCompare(b[0].toString()));
        
        const registeredGameIds = new Set();
        if (usersSnap && usersSnap.val()) {
            Object.values(usersSnap.val()).forEach(u => {
                if (u.gameId) registeredGameIds.add(u.gameId.toString().trim());
                if (u.linkedGameIds && Array.isArray(u.linkedGameIds)) {
                    u.linkedGameIds.forEach(id => registeredGameIds.add(id.toString().trim()));
                }
            });
        }
        
        let html = `<div class="card" style="margin-bottom:20px; text-align:center;">
                      <div class="card-title" style="margin-bottom:15px; font-size:24px;">🕵️‍♂️ Player Lookup</div>

                      <select id="playerLookupSelect" style="width:100%; max-width:400px; padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); font-size:16px; font-weight:bold; cursor:pointer;">
                        <!-- Options rendered via JS -->
                      </select>
                    </div>
                    
                    <div id="playerProfileContainer">
                      <div style="text-align:center; color:var(--text-muted); padding:40px; font-size:16px;">
                        Select a player to view their activity profile.
                      </div>
                    </div>`;
                    
        app.innerHTML = html;
        
        const select = document.getElementById('playerLookupSelect');
        const container = document.getElementById('playerProfileContainer');
        const regToggle = document.getElementById('registeredOnlyToggle');
        
        const renderDropdownOptions = () => {
            const onlyReg = globalRosterRegisteredOnly || (regToggle && regToggle.checked);
            let optsHtml = '<option value="">-- Select a Chief --</option>';
            players.forEach((p, i) => {
                let name = p[0].toString().trim();
                let isReg = false;
                let gid = nameToIdMap[name];
                if (gid && registeredGameIds.has(gid.toString().trim())) isReg = true;
                
                if (onlyReg && !isReg) return;
                
                let nt = /^[ -~]*$/.test(name) ? 'class="notranslate"' : '';
                optsHtml += `<option value="${i}" ${nt}>${name}${isReg ? ' (✅)' : ''}</option>`;
            });
            select.innerHTML = optsHtml;
        };
        
        renderDropdownOptions();
      
      const renderCardForChief = (idx) => {
        if (idx === "") {
          container.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:40px; font-size:16px;">Select a player to view their activity profile.</div>`;
          window.currentRosterChiefName = null;
          return;
        }
        
        const p = players[idx];
        const chiefName = p[0].toString().trim();
        window.currentRosterChiefName = chiefName;
        
        let dynamicSD = null;
        if (allTimeRankingsMap[chiefName]) {
          dynamicSD = allTimeRankingsMap[chiefName];
        }
        
        let lbData = lbMap[chiefName];
        let bearBoth = null, bear1 = null, bear2 = null, bearAllTime = null, btDonationsAllTime = null, btDonationsCurrent = null;
        let otherLbs = [];
        if (lbData) {
            lbData.forEach(lb => {
                if (lb.title.toLowerCase().includes('all-time showdown')) return;
                let t = lb.title.toLowerCase();
                if (t.includes('all-time bear trap')) bearAllTime = lb;
                else if (t.includes('bear trap 1')) bear1 = lb;
                else if (t.includes('bear trap 2')) bear2 = lb;
                else if (t.includes('both bear trap')) bearBoth = lb;
                else if (t.includes('all-time bear donations')) btDonationsAllTime = lb;
                else if (t.includes('bear donations')) btDonationsCurrent = lb;
                else otherLbs.push(lb);
            });
        }
        
        let html = window.generatePlayerProfileHtml(chiefName, p, headers, colIsUpcoming, rosterMap[chiefName], lbData, dynamicSD, showdownActive, bearBoth, bear1, bear2, bearAllTime, btDonationsAllTime, btDonationsCurrent, otherLbs, false);
        container.innerHTML = html;
      };
      
      select.addEventListener('change', (e) => {
        renderCardForChief(e.target.value);
      });
      
      if (window.currentRosterChiefName) {
        let idx = players.findIndex(p => p[0].toString().trim() === window.currentRosterChiefName);
        if (idx !== -1) {
          select.value = idx;
          renderCardForChief(idx);
        }
      }
      
    } catch(e) { renderError(e.message); }
  },
  giftcodes: async () => {
    app.innerHTML = `
      <div class="card" style="display:flex; flex-direction:column; height: 85vh; min-height: 800px; padding:0; overflow:hidden; animation: fadeIn 0.3s ease;">
        <div style="padding:15px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:10px;">
          <span style="font-size:24px;">🎁</span>
          <h2 style="margin:0; font-size:20px; color:var(--text-main);">Auto Redeem Sign-up</h2>
        </div>
        <div style="flex:1; width:100%; position:relative; background:var(--bg-main);">
          <iframe 
            src="https://forms.gle/zy4W2Fa1HDEr1hKBA" 
            style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;"
            frameborder="0" 
            marginheight="0" 
            marginwidth="0">
            Loading…
          </iframe>
        </div>
      </div>
    `;
  },
  

  schedule: async () => {
    window.refreshSchedule = async () => {
      const icon = document.getElementById('schRefreshIcon');
      if(icon) icon.style.animation = 'spin 1s linear infinite';
      
      if (window.showToast) window.showToast("Refreshing schedule...", "info");
      
      // Clear live data cache to force a fresh fetch from Firebase
      delete window.liveData["schedule"];
      delete window.livePromises["schedule"];
      if (window.liveListeners["schedule"]) {
          window.liveListeners["schedule"](); // unsubscribe
          delete window.liveListeners["schedule"];
      }
      
      setTimeout(async () => {
        await views.schedule();
        if (window.showToast) window.showToast("Schedule refreshed!", "success", true);
      }, 400);
    };

    renderLoading("Loading Schedule");
    try {
      const data = await fetchSheet("schedule");
      
      if (!data || !Array.isArray(data) || data.length === 0) {
  
      app.innerHTML = `<div class="card"><div class="loading">⚠️ Schedule data is currently unavailable. Please try again later.</div></div>`;
        return;
      }
      
      // Find the row that contains the dates
      let dateRowIdx = -1;
      for (let r = 0; r < data.length; r++) {
        if (data[r].some(cell => typeof cell === 'string' && cell.match(/^\d{4}-\d{2}-\d{2}T/))) {
          dateRowIdx = r;
          break;
        }
      }
      
      if (dateRowIdx === -1) {
        app.innerHTML = `<div class="card"><div class="loading">Could not find dates in schedule.</div></div>`;
        return;
      }
      
      // Map each date to its column index
      let days = [];
      for (let c = 0; c < data[dateRowIdx].length; c++) {
        let cell = data[dateRowIdx][c];
        if (typeof cell === 'string' && cell.match(/^\d{4}-\d{2}-\d{2}T/)) {
          let [year, month, day] = cell.split('T')[0].split('-');
          let d = new Date(year, month - 1, day);
          let formatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          days.push({ dateStr: formatted, colIdx: c, categories: {} });
        }
      }
      
      // Extract events for each day, grouping by category
      let currentCategory = "Events";
      for (let r = dateRowIdx + 1; r < data.length; r++) {
        if (data[r].every(cell => cell === "")) continue;
        
        // Detect category headers: A row with exactly one non-empty cell located in Column B (index 1)
        let nonEmptyCells = data[r].filter(c => c !== "");
        if (nonEmptyCells.length === 1 && typeof data[r][1] === 'string' && data[r][1].trim() !== "") {
          currentCategory = data[r][1].trim();
          continue;
        }
        
        days.forEach(day => {
          let eventCell = data[r][day.colIdx];
          if (eventCell && eventCell.trim() !== "") {
            if (!day.categories[currentCategory]) day.categories[currentCategory] = [];
            day.categories[currentCategory].push(eventCell);
          }
        });
      }
      
      // Render the timeline as Daily Cards
      let html = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:15px;">
                    <div style="display:flex; align-items:center; gap:15px;">
                      <h2 style="color:var(--text-main); margin:0;">📅 Event Schedule</h2>
                      <button onclick="window.refreshSchedule()" style="background:var(--card-bg); color:var(--text-main); border:1px solid var(--border); padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px; font-weight:bold; display:flex; align-items:center; gap:5px;">
                        <span id="schRefreshIcon">🔄</span> Refresh
                      </button>
                    </div>
                    <a href="https://www.google.com/url?q=https://calendar.google.com/calendar/u/0?cid%3DMWZkOTI2ZjdkNzVhYWIyMzM1N2IxYjE1NTc5MzE2YTRlYTRjMDI3NjA4NDlmOTRkZjg2MDRlZWY5YjdiMTI1OEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&sa=D&source=editors&ust=1783297509664500&usg=AOvVaw3Nu5FI78rflI7vvCvxd5MS" target="_blank" style="background:#0ea5e9; color:#fff; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:14px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">➕ Add to Google Calendar</a>
                  </div>`;
      html += `<div style="display:flex; flex-wrap:wrap; gap:20px;">`;
      
      days.forEach(day => {
        html += `<div class="card" style="flex: 1; min-width: 250px; padding:0; overflow:hidden;">
                   <div style="background:var(--accent); color:#fff; padding:15px; text-align:center; font-weight:bold; font-size:18px;">
                     ${day.dateStr}
                   </div>
                   <div style="padding:15px;">`;
                   
        let catKeys = Object.keys(day.categories);
        if (catKeys.length === 0) {
          html += `<div style="padding:10px 0; color:var(--text-muted); text-align:center; font-style:italic;">No Events</div>`;
        } else {
          catKeys.forEach((cat, index) => {
            // Add extra top margin for categories after the first one (e.g. between Events and Rewards)
            let topMargin = index === 0 ? "5px" : "25px";
            html += `<div style="font-weight:bold; color:var(--text-main); margin-top:${topMargin}; margin-bottom:8px; text-transform:uppercase; font-size:11px; letter-spacing:1px;">${cat}</div>`;
            html += `<ul style="list-style:none; padding:0; margin:0; margin-bottom:15px;">`;
            day.categories[cat].forEach((ev, idx) => {
              html += `<li style="padding:8px 0; font-size:14px; color:var(--text-muted);">
                         ${ev.includes('Bear Trap') ? '🪤' : '✨'} ${ev}
                       </li>`;
            });
            html += `</ul>`;
          });
        }
        html += `</div></div>`;
      });
      
      html += `</div>`;
      app.innerHTML = html;
    } catch(e) { renderError(e.message); }
  },
  
  todays_schedule: async () => {
    renderLoading("Loading Today's Events");
    try {
      const data = await fetchSheet("WhiteOut Survival");
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        app.innerHTML = `<div class="card"><div class="loading">⚠️ Today's schedule data is currently unavailable. Please try again later.</div></div>`;
        return;
      }
      
      let todayHtml = "";
      let upcomingHtml = "";
      let currentCategory = "today";
      
      for (let i = 1; i < Math.min(34, data.length); i++) {
        let row = data[i];
        let eventName = row[5];
        let originalDateVal = row[6];
        let originalUtcVal = row[7];
        let pdtVal = row[8];
        
        let dateVal = originalDateVal;
        let utcVal = originalUtcVal;
        
        if (!eventName || eventName.toString().trim() === "" || eventName.includes("Event's")) continue;
        
        let isPast = false;
        let localTimeStr = "";
        let hasDate = (typeof originalDateVal === 'string' && originalDateVal.match(/^\d{4}-\d{2}-\d{2}T/));
        
        if (hasDate) {
          let eventDate = new Date(originalDateVal);
          let now = new Date();
          
          let isToday = (eventDate.getDate() === now.getDate() && eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear());
          if (isToday) {
            currentCategory = "today";
          } else {
            currentCategory = "upcoming";
          }
          
          dateVal = (eventDate.getMonth()+1) + '/' + eventDate.getDate();
          
          if (typeof utcVal === 'string' && utcVal.match(/^\d{4}-\d{2}-\d{2}T/)) {
            let gasDate = new Date(utcVal);
            
            // Google Apps Script reads plain times as 1899-12-30 in the script's timezone (PST = UTC-8).
            // So it added 8 hours to whatever the user typed. We subtract 8 hours to get the EXACT time the user typed.
            gasDate.setUTCHours(gasDate.getUTCHours() - 8);
            
            let trueUtcHour = gasDate.getUTCHours();
            let trueUtcMinute = gasDate.getUTCMinutes();
            
            // Format the True UTC time for the table in 24-hour standard format (e.g. 16:00)
            let h24 = trueUtcHour.toString().padStart(2, '0');
            let mStr = trueUtcMinute.toString().padStart(2, '0');
            utcVal = `${h24}:${mStr}`;
            
            // Calculate the visitor's local time by treating that time as UTC!
            let todayLocal = new Date();
            todayLocal.setUTCHours(trueUtcHour, trueUtcMinute, 0, 0);
            localTimeStr = todayLocal.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            // Check if exact event time is in the past
            let exactEventDate = new Date(eventDate);
            exactEventDate.setUTCHours(trueUtcHour, trueUtcMinute, 0, 0);
            if (exactEventDate < now) {
              isPast = true;
            }
          } else {
            if (utcVal === undefined) utcVal = "";
            // For all-day events or events with no time, strike if it's strictly before today
            if (!isToday && eventDate < now) {
              isPast = true;
            }
          }
        } else {
          if (dateVal === undefined) dateVal = "";
          if (utcVal === undefined) utcVal = "";
        }
        
        let rowHtml = "";
        
        // Handle Headers
        if (eventName === "Rewards" || eventName === "TimeZones" || eventName === "Date") {
          let titleColor = eventName === "Rewards" ? "#eab308" : "#10b981"; // Gold for Rewards, Green for others
          let col4Text = eventName === "Rewards" ? pdtVal : "Your Time";
          
          rowHtml += `<tr style="height:30px;"></tr>
                   <tr>
                     <td style="font-weight:bold; color:${titleColor}; font-size:16px; padding-top:20px; text-transform:uppercase; border-bottom:2px solid var(--border);">${eventName}</td>
                     <td style="font-weight:bold; color:var(--text-muted); padding-top:20px; border-bottom:2px solid var(--border);">${dateVal}</td>
                     <td style="font-weight:bold; color:var(--text-muted); padding-top:20px; border-bottom:2px solid var(--border);">${utcVal}</td>
                     <td style="font-weight:bold; color:var(--text-muted); padding-top:20px; border-bottom:2px solid var(--border);">${col4Text}</td>
                   </tr>`;
        } else {
          let styleStr = isPast ? `text-decoration:line-through; opacity:0.5;` : `font-weight:500;`;
          
          // Display the original PDT value if no local time was calculated (e.g. text like "No Events")
          let finalCol4Text = localTimeStr || pdtVal || "";
          
          rowHtml += `<tr style="${styleStr}">
                     <td>${eventName.toString().includes('Bear Trap') ? '🪤' : '✨'} ${eventName}</td>
                     <td>${dateVal}</td>
                     <td>${utcVal}</td>
                     <td>${finalCol4Text}</td>
                   </tr>`;
        }
        
        if (currentCategory === "today") {
          todayHtml += rowHtml;
        } else {
          upcomingHtml += rowHtml;
        }
      }
      
      let finalHtml = `<div style="display:flex; flex-direction:column; gap:20px;">`;
      
      if (todayHtml !== "") {
        finalHtml += `<div class="card" style="overflow-x:auto;">
                        <div class="card-title">🕒 Today's Schedule</div>
                        <table><thead><tr>
                          <th>Event</th><th>Date</th><th>UTC</th><th>Your Time</th>
                        </tr></thead><tbody>${todayHtml}</tbody></table></div>`;
      } else {
        finalHtml += `<div class="card" style="overflow-x:auto;">
                        <div class="card-title">🕒 Today's Schedule</div>
                        <div style="padding: 20px; text-align: center; color: var(--text-muted);">No events scheduled for today.</div>
                      </div>`;
      }
      
      if (upcomingHtml !== "") {
        finalHtml += `<div class="card" style="overflow-x:auto;">
                        <div class="card-title">📅 Upcoming Schedule</div>
                        <table><thead><tr>
                          <th>Event</th><th>Date</th><th>UTC</th><th>Your Time</th>
                        </tr></thead><tbody>${upcomingHtml}</tbody></table></div>`;
      }
      
      finalHtml += `</div>`;
      app.innerHTML = finalHtml;
      
    } catch(e) { renderError(e.message); }
  },
  
  contact: async () => {
    app.innerHTML = `
      <div class="card" style="display:flex; flex-direction:column; height: 85vh; min-height: 800px; padding:0; overflow:hidden; animation: fadeIn 0.3s ease;">
        <div style="padding:15px 20px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:24px;">💬</span>
            <h2 style="margin:0; font-size:20px; color:var(--text-main);">Support & Feedback</h2>
          </div>
          <a href="https://tiny.cc/BrianDivaCox" target="_blank" style="display:inline-flex; align-items:center; gap:6px; background:#5865F2; color:#fff; padding:6px 12px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:13px; transition:0.2s;">
            <span style="font-size:16px;">👾</span> Join Discord
          </a>
        </div>
        <div style="flex:1; width:100%; position:relative; background:var(--bg-main);">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSdL6uJrUBV05I3NIfwTVyGd0Bx6osn2ZEBGeyp2RnwJZxujXA/viewform?embedded=true" 
            style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;"
            frameborder="0" 
            marginheight="0" 
            marginwidth="0">
            Loading…
          </iframe>
        </div>
      </div>
    `;
  },

  
  analytics: async () => {
    renderLoading("Loading Analytics");
    try {
      const rosterRawData = await fetchSheet("Chief's List");
      
      if (!rosterRawData || rosterRawData.length < 2) throw new Error("No data found.");
      
      let giftCodesYes = 0;
      let giftCodesNo = 0;
      
      // Parse roster data to count gift code redemptions
      // Column C (index 2) holds the Gift Codes boolean
      for (let i = 1; i < rosterRawData.length; i++) {
        let name = rosterRawData[i][0];
        if (name && name.toString().trim() !== "") {
          let gcVal = rosterRawData[i][2];
          if (gcVal !== undefined && gcVal !== null && gcVal !== "") {
            let strVal = gcVal.toString().toLowerCase().trim();
            if (gcVal === true || strVal === "true" || strVal === "✓" || strVal === "yes") {
              giftCodesYes++;
            } else if (gcVal === false || strVal === "false" || strVal === "✗" || strVal === "no") {
              giftCodesNo++;
            } else {
              giftCodesNo++; // Treat any weird string as not signed up
            }
          } else {
            giftCodesNo++; // Treat missing as not signed up
          }
        }
      }
      
      let html = `
        <div class="card" style="margin-bottom:20px; text-align:center;">
          <div class="card-title" style="margin-bottom:5px; font-size:24px;">📊 Visual Analytics</div>
          <p style="color:var(--text-muted); font-size:14px; margin-bottom:25px;">Live metrics automatically generated from your Alliance database.</p>
          
          <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:30px;">
            <div style="background:var(--bg-main); border:1px solid var(--border); border-radius:12px; padding:20px; width:100%; max-width:400px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
              <h3 style="color:var(--text-main); margin-top:0; margin-bottom:15px; font-size:18px;">Gift Code Auto Redeem</h3>
              <div style="position:relative; height:250px; width:100%; display:flex; justify-content:center;">
                <canvas id="giftCodeChart"></canvas>
              </div>
              <div style="margin-top:15px; font-size:14px; color:var(--text-muted);">
                <span style="color:var(--success); font-weight:bold;">${giftCodesYes}</span> Enrolled | 
                <span style="color:var(--danger); font-weight:bold;">${giftCodesNo}</span> Missing
              </div>
            </div>
            
            <!-- Placeholder for future charts -->
            <div style="background:var(--bg-main); border:1px solid var(--border); border-radius:12px; padding:20px; width:100%; max-width:400px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px rgba(0,0,0,0.05); min-height:300px;">
              <div style="color:var(--text-muted); font-style:italic; opacity:0.7;">
                More analytics coming soon...
              </div>
            </div>
          </div>
        </div>
      `;
      
      app.innerHTML = html;
      
      // Render Chart using Chart.js after the canvas is in the DOM
      // We must get the current accent color from CSS variables
      const rootStyle = getComputedStyle(document.documentElement);
      let accentColor = rootStyle.getPropertyValue('--accent').trim();
      let cardBg = rootStyle.getPropertyValue('--card-bg').trim();
      let textColor = rootStyle.getPropertyValue('--text-main').trim();
      
      const ctx = document.getElementById('giftCodeChart').getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Enrolled', 'Not Enrolled'],
          datasets: [{
            data: [giftCodesYes, giftCodesNo],
            backgroundColor: [
              accentColor, // dynamically matches theme
              '#475569'    // Slate color for not enrolled
            ],
            borderWidth: 2,
            borderColor: cardBg,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: textColor,
                font: {
                  family: 'monospace',
                  size: 12
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              titleFont: { family: 'monospace' },
              bodyFont: { family: 'monospace' },
              padding: 10,
              cornerRadius: 8
            }
          },
          cutout: '70%'
        }
      });
      
    } catch(e) { renderError(e.message); }
  }
};

// --- GLOBAL TIMERS ---
// Clock format preference (12 or 24)
let clockFormat = localStorage.getItem('clockFormat') || '12';

// Highlight active clock format button
function updateClockFormatUI() {
  document.querySelectorAll('.clock-fmt-btn').forEach(btn => {
    if (btn.getAttribute('data-format') === clockFormat) {
      btn.style.background = 'var(--accent)';
      btn.style.color = '#fff';
    } else {
      btn.style.background = 'transparent';
      btn.style.color = 'var(--text-muted)';
    }
  });
}

// Clock format toggle click handler
document.querySelectorAll('.clock-fmt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    clockFormat = btn.getAttribute('data-format');
    localStorage.setItem('clockFormat', clockFormat);
    updateClockFormatUI();
    updateGlobalTimers();
  });
});

updateClockFormatUI();

function formatClockTime(hours, minutes, seconds, use12hr) {
  if (use12hr) {
    const period = hours >= 12 ? 'PM' : 'AM';
    let h12 = hours % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
  } else {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

function updateGlobalTimers() {
  const now = new Date();
  const is12 = clockFormat === '12';
  
  // UTC Clock
  const utcClockEl = document.getElementById('utc-clock');
  if (utcClockEl) {
    utcClockEl.textContent = formatClockTime(now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), is12);
  }
  
  // Local Clock
  const localClockEl = document.getElementById('local-clock');
  if (localClockEl) {
    localClockEl.textContent = formatClockTime(now.getHours(), now.getMinutes(), now.getSeconds(), is12);
  }
  
  // Reset Timer (Reset is at 00:00 UTC)
  const resetTimerEl = document.getElementById('reset-timer');
  if (resetTimerEl) {
    let nextReset = new Date();
    nextReset.setUTCHours(24, 0, 0, 0); // Next midnight UTC
    
    let diff = nextReset - now;
    let hours = Math.floor(diff / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    
    resetTimerEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
  }
}

setInterval(updateGlobalTimers, 1000);
updateGlobalTimers();

// Handle Navigation
const allLinks = document.querySelectorAll('.nav-link, .sub-link');
allLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetEl = e.currentTarget;
    
    // Exclude the Theme Settings link since it handles itself
    if (targetEl.id === 'mobileSettingsBtn') return;
    
    // Mobile dropdown toggle logic
    if (window.innerWidth <= 768 && targetEl.classList.contains('nav-link') && targetEl.nextElementSibling && targetEl.nextElementSibling.classList.contains('dropdown-content')) {
      e.preventDefault();
      e.stopPropagation(); // Prevent the document click listener from firing
      
      const parent = targetEl.parentElement;
      const isOpen = parent.classList.contains('open');
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== parent) d.classList.remove('open');
      });
      
      // Toggle this one
      if (isOpen) {
        parent.classList.remove('open');
      } else {
        parent.classList.add('open');
      }
      return;
    }
    
    e.preventDefault();
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    // If it's a sub-link in a dropdown, highlight the parent nav-link
    if (targetEl.classList.contains('sub-link')) {
      targetEl.closest('.dropdown').querySelector('.nav-link').classList.add('active');
    } else {
      targetEl.classList.add('active');
    }
    
    // Auto-close the hamburger menu if it's open
    if (mobileMenu) mobileMenu.classList.remove('open');
    
    const target = targetEl.getAttribute('data-target');
    const filter = targetEl.getAttribute('data-filter');
    if (views[target]) {
      if (target === 'admin') window.activeViewFunc = null;
      else window.activeViewFunc = () => views[target](filter);
      
      views[target](filter);
    }
  });
});

// Initial load
window.activeViewFunc = () => views.home();
views.home();
initPresence();

window.views = views;


window.generatePlayerProfileHtml = (chiefName, p, headers, colIsUpcoming, rosterInfo, lbData, dynamicSD, showdownActive, bearBoth, bear1, bear2, bearAllTime, btDonationsAllTime, btDonationsCurrent, otherLbs, isAdmin = false) => {
  let headerBadgesHtml = '';
  if (rosterInfo) {
    let gcVal = rosterInfo.giftCodes;
    if (gcVal === true || gcVal === 'TRUE' || (typeof gcVal === 'string' && gcVal.toLowerCase().trim() === 'true')) {
       headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--success) 15%, transparent); border:1px solid var(--success); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">✅ All Gift Codes</span>';
    }
    let taVal = rosterInfo.timeActive;
    if (taVal && taVal.toString().trim() !== "") {
       headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--text-main) 10%, transparent); border:1px solid var(--border); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">⏱️ '+taVal+'</span>';
    }
  }
  
  let activityBadges = '';
  let missedDays = p[1];
  if (showdownActive) {
    if (missedDays === undefined || missedDays === null || missedDays.toString().trim() === "" || missedDays === 0 || missedDays === "0") {
       activityBadges += '<span style="background:color-mix(in srgb, #f97316 15%, transparent); border:1px solid #f97316; color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🔥 Perfect Attendance</span>';
    }
  }
  
  const isTrue = (val) => val === true || (typeof val === 'string' && val.toLowerCase().trim() === 'true');
  
  if (isTrue(p[2])) {
     activityBadges += '<span style="background:color-mix(in srgb, #fbbf24 15%, transparent); border:1px solid #fbbf24; color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🏆 Championship</span>';
  }
  if (isTrue(p[3])) {
     activityBadges += '<span style="background:color-mix(in srgb, #ef4444 15%, transparent); border:1px solid #ef4444; color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">⚔️ Mercenary</span>';
  }
  if (isTrue(p[4])) {
     activityBadges += '<span style="background:color-mix(in srgb, #38bdf8 15%, transparent); border:1px solid #38bdf8; color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🐻‍❄️ Polar Terrors</span>';
  }
  
  if (activityBadges) {
     headerBadgesHtml += '<div style="display:flex; gap:10px; margin-top:8px; flex-wrap:wrap;">' + activityBadges + '</div>';
  }
  
  if ((lbData && lbData.length > 0) || dynamicSD || bear1 || bear2 || bearBoth || bearAllTime || isAdmin) {
    headerBadgesHtml += '<div style="display:flex; gap:10px; margin-top:8px; flex-wrap:wrap; align-items:center;">';
    
    if (dynamicSD) {
       let scoreStr = Number(dynamicSD.score).toLocaleString();
       headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🏅 All-Time Showdown: <span style="color:var(--text-main);">#'+dynamicSD.rank+' ('+scoreStr+')</span></span>';
    }
    
    if (bear1 || bear2 || bearBoth || bearAllTime) {
       let allTimeStr = bearAllTime ? '#' + bearAllTime.rank + ' (' + bearAllTime.score + ') All-Time' : '0 All-Time';
       
       let currentParts = [];
       if (bear1) currentParts.push('T1: #' + bear1.rank + ' (' + bear1.score + ')');
       if (bear2) currentParts.push('T2: #' + bear2.rank + ' (' + bear2.score + ')');
       
       let subStr = "";
       if (currentParts.length > 0) {
           subStr = '(' + currentParts.join(' | ') + ')';
       } else if (bearBoth) {
           subStr = '(Total: #' + bearBoth.rank + ' (' + bearBoth.score + '))';
       } else {
           subStr = '0 Current';
       }
       
       let innerText = allTimeStr + ' | ' + subStr;
       
       headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🐻 Bear Trap Wins: <span style="color:var(--text-main);">'+innerText+'</span></span>';
    }
    let btColIndex = -1;
    if (headers) {
        btColIndex = headers.findIndex(h => typeof h === 'string' && h.toLowerCase().trim() === 'total bt donations');
    }
    let hasFallbackCurrent = (btColIndex !== -1 && p && p[btColIndex] !== undefined && p[btColIndex] !== "");

    if (btDonationsCurrent || btDonationsAllTime || hasFallbackCurrent) {
         let allTimeStr = btDonationsAllTime ? '#' + btDonationsAllTime.rank + ' (' + btDonationsAllTime.score + ') All-Time' : '0 All-Time';
         let currentScoreStr = "0";
         if (btDonationsCurrent) {
             currentScoreStr = '#' + btDonationsCurrent.rank + ' (' + btDonationsCurrent.score + ')';
         } else if (hasFallbackCurrent) {
             currentScoreStr = '(' + p[btColIndex].toString() + ')';
         }
         let currentStr = currentScoreStr + ' Current';
         let innerText = allTimeStr + ' | ' + currentStr;
         headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🐻 BT Donations: <span style="color:var(--text-main);">'+innerText+'</span></span>';
      }
      
      if (isAdmin) {
       // Buttons moved to top admin bar
    }
    
    otherLbs.forEach(lb => {
      headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">' + lb.emoji + ' ' + lb.title + ': <span style="color:var(--text-main);">' + lb.score + '</span></span>';
    });
    
    headerBadgesHtml += '</div>';
  }
  
  let metricsHtml = '<div style="margin-top: 25px;">';
  metricsHtml += '<h3 style="margin: 0 0 5px 0; color:var(--text-main); font-size:16px; border-bottom:1px solid var(--border); padding-bottom:8px;">📅 Events Checklist</h3>';
  metricsHtml += '<p style="font-size:11px; color:var(--text-muted); margin:0 0 15px 0;">✅ = Participated / Done <span style="margin:0 5px;">|</span> ❌ = Action Required <span style="margin:0 5px;">|</span> ⏳ = Upcoming</p>';
  metricsHtml += '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:15px;">';
  
  let missedEvents = [];
  const supportedEvents = ["Championship", "Polar Terrors", "Mercenary Prestige", "Voter"];
  
  for (let col = 1; col < headers.length; col++) {
    let header = headers[col] || "Metric " + col;
    if (header.toLowerCase().includes("bt donation")) continue;
    
    let val = p[col];
    let isX = false;
    
    if (val === undefined || val === null || val.toString().trim() === "") {
      val = "<span style='color:var(--text-muted);'>-</span>";
      isX = true; // empty treats as action required
    } else {
      let strVal = val.toString().toLowerCase().trim();
      if (val === true || strVal === "true" || strVal === "✅" || strVal === "yes") {
        val = "✅";
      } else if (val === false || strVal === "false" || strVal === "❌" || strVal === "no") {
        val = colIsUpcoming[col] ? "⏳" : "❌";
        isX = true; // Include both missed and upcoming in the missedEvents array for Admin Quick Fix
      }
    }
    
    let boxStyle = "background:var(--bg-main); border:1px solid var(--border); border-radius:8px; padding:15px; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.05); transition:transform 0.2s;";
    let boxContent = '<div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; font-weight:bold;">'+header+'</div>';
    boxContent += '<div style="font-size:18px; font-weight:bold; color:var(--text-main);">'+val+'</div>';
    
    if (isX && supportedEvents.some(s => header.toLowerCase().includes(s.toLowerCase()))) {
       missedEvents.push(header);
    }
    
    metricsHtml += '<div style="'+boxStyle+'">' + boxContent + '</div>';
  }
  metricsHtml += '</div></div>';
  
  let playerGameId = nameToIdMap[chiefName];
  let tryUrl = (playerGameId && avatarMap[playerGameId]) ? avatarMap[playerGameId] : 'images/' + chiefName + '.png';
  
  let avatarImgHtml = '<img src="'+tryUrl+'" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';"><div style="display:none; align-items:center; justify-content:center; width:100%; height:100%;">' + chiefName.charAt(0).toUpperCase() + '</div>';
  
  let adminBarHtml = '';
  if (isAdmin) {
    let missedJson = encodeURIComponent(JSON.stringify(missedEvents));
    let adminActionBtn = '';
    if (playerGameId) {
        if (window.isAdminUser({gameId: parseInt(playerGameId)})) {
            adminActionBtn = `<button onclick="window.revokeAdmin('${playerGameId}')" style="background:rgba(231,76,60,0.1); color:var(--danger); border:1px solid rgba(231,76,60,0.3); padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px; text-align:left; width:100%; transition: 0.2s;" onmouseover="this.style.background='rgba(231,76,60,0.2)'" onmouseout="this.style.background='rgba(231,76,60,0.1)'">❌ Revoke Admin</button>`;
        } else {
            adminActionBtn = `<button onclick="window.grantAdmin('${playerGameId}')" style="background:rgba(52,152,219,0.1); color:var(--accent); border:1px solid rgba(52,152,219,0.3); padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px; text-align:left; width:100%; transition: 0.2s;" onmouseover="this.style.background='rgba(52,152,219,0.2)'" onmouseout="this.style.background='rgba(52,152,219,0.1)'">🛡️ Grant Admin</button>`;
        }
    }
    
    adminBarHtml = `
      <div style="position:relative; display:inline-block;">
        <button onclick="const m = this.nextElementSibling; if(m.style.display==='flex'){m.style.display='none';}else{document.querySelectorAll('.admin-dropdown-menu').forEach(d=>d.style.display='none'); m.style.display='flex';} event.stopPropagation();" style="background:var(--accent); color:#fff; border:none; padding:8px 14px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:13px; display:flex; align-items:center; gap:5px; transition:0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
          ⚙️ Actions ▾
        </button>
        <div class="admin-dropdown-menu" style="display:none; flex-direction:column; gap:8px; position:absolute; top:100%; right:0; margin-top:8px; background:var(--card-bg); border:1px solid var(--border); border-radius:8px; padding:10px; min-width:180px; box-shadow:0 10px 25px rgba(0,0,0,0.5); z-index:100;" onclick="event.stopPropagation();">
          ${adminActionBtn ? adminActionBtn : ''}
          <button onclick="window.promptLogBearTrapWinner('${chiefName}')" style="background:rgba(255,215,0,0.1); color:#FFD700; border:1px solid rgba(255,215,0,0.3); padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px; text-align:left; transition: 0.2s;" onmouseover="this.style.background='rgba(255,215,0,0.2)'" onmouseout="this.style.background='rgba(255,215,0,0.1)'">👑 Crown Winner</button>
          <button onclick="window.promptBearTrap('${chiefName}')" style="background:rgba(46,204,113,0.1); color:var(--success); border:1px solid rgba(46,204,113,0.3); padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px; text-align:left; transition: 0.2s;" onmouseover="this.style.background='rgba(46,204,113,0.2)'" onmouseout="this.style.background='rgba(46,204,113,0.1)'">🥩 + Bear Donation</button>
          <button onclick="window.promptEditEvents('${chiefName}', decodeURIComponent('${missedJson}'))" style="background:rgba(52,152,219,0.1); color:var(--accent); border:1px solid rgba(52,152,219,0.3); padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px; text-align:left; transition: 0.2s;" onmouseover="this.style.background='rgba(52,152,219,0.2)'" onmouseout="this.style.background='rgba(52,152,219,0.1)'">📝 Edit Events</button>
        </div>
      </div>
    `;
  }
  
  let html = '<div class="card" style="margin-bottom:20px; animation: fadeIn 0.3s ease;"><div style="display:flex; align-items:center; gap:20px; margin-bottom:15px; flex-wrap:wrap;"><div style="width:70px; height:70px; border-radius:50%; overflow:hidden; background:var(--accent); color:#fff; font-size:32px; font-weight:bold; display:flex; justify-content:center; align-items:center; border:2px solid var(--border); box-shadow:0 4px 10px rgba(0,0,0,0.1); flex-shrink:0;">' + avatarImgHtml + '</div><div style="flex:1; min-width:200px;"><div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;"><h2 style="margin:0; font-size:24px; color:var(--text-main); display:flex; align-items:center; gap:10px; word-break:break-word;">' + chiefName + '</h2>' + adminBarHtml + '</div>' + headerBadgesHtml + '</div></div>' + metricsHtml + '</div>';
  return html;
};

window.promptEditEvents = (name, missedEventsStr) => {
  let missedEvents = [];
  try { missedEvents = JSON.parse(missedEventsStr); } catch (e) {}
  
  if (missedEvents.length === 0) {
    if (window.showToast) { window.showToast("This player has no supported missing events this week.", "info"); } else { alert("This player has no supported missing events this week."); }
    return;
  }
  
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); z-index:10001; display:flex; justify-content:center; align-items:center;';
  
  let checkboxHtml = missedEvents.map((ev, i) => `
    <label style="display:flex; align-items:center; gap:10px; background:var(--bg-main); padding:12px; border-radius:8px; border:1px solid var(--border); cursor:pointer;">
      <input type="checkbox" id="evCheck${i}" value="${ev}" style="width:18px; height:18px; cursor:pointer;">
      <span style="font-weight:bold; color:var(--text-main);">${ev}</span>
    </label>
  `).join('');
  
  modal.innerHTML = `
    <div style="background:var(--card-bg); border:1px solid var(--border); border-radius:12px; padding:30px; max-width:400px; width:90%; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
      <h2 style="margin:0 0 5px 0; color:var(--text-main); font-size:20px;">📝 Edit Events for ${name}</h2>
      <p style="margin:0 0 20px 0; color:var(--text-muted); font-size:13px;">Select the events below to mark them as Participated (✅).</p>
      
      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px; max-height:300px; overflow-y:auto;">
        ${checkboxHtml}
      </div>
      
      <div style="display:flex; gap:10px;">
        <button id="cancelEvBtn" style="flex:1; padding:10px; border-radius:8px; border:1px solid var(--border); background:transparent; color:var(--text-muted); cursor:pointer; font-weight:bold; font-size:13px;">Cancel</button>
        <button id="submitEvBtn" style="flex:2; padding:10px; border-radius:8px; border:none; background:var(--accent); color:#fff; cursor:pointer; font-weight:bold; font-size:13px;">Submit Updates</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  modal.querySelector('#cancelEvBtn').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  
  modal.querySelector('#submitEvBtn').addEventListener('click', async () => {
    let checked = [];
    for (let i = 0; i < missedEvents.length; i++) {
      if (document.getElementById(`evCheck${i}`).checked) checked.push(missedEvents[i]);
    }
    
    if (checked.length === 0) {
      alert("No events selected.");
      return;
    }
    
    modal.remove();
    const adminName = currentUser ? (idToNameMap[currentUser.gameId] || "Admin") : "Admin";
    
    for (let i = 0; i < checked.length; i++) {
      let ev = checked[i];
      window.showToast(`Updating ${ev} (${i+1}/${checked.length})...`, "success");
      
      let eventSheetName = ev;
      if (ev.toLowerCase().includes('championship')) eventSheetName = "Alliance Championship ";
      
      try {
        const res = await fetch(`${API_BASE_URL}?api=updateEvent&name=${encodeURIComponent(name)}&eventName=${encodeURIComponent(eventSheetName)}&status=yes&admin=${encodeURIComponent(adminName)}`).then(r => r.json());
        if (!res.success) {
          alert(`Error updating ${ev}: ${res.message}`);
          break; // stop on error
        }
      } catch (err) {
        alert(`Network Error on ${ev}: ${err.message}`);
        break; // stop on error
      }
    }
    
    window.showToast("Updates complete!", "success", true);
    window.sheetCache = {}; 
    if (document.getElementById('uniSearchInput')) {
      window.searchPlayerFull(name); 
    } else {
      views.roster();
    }
  });
};

window.promptBearTrap = async (name) => {
  let amt = prompt("Enter Bear Trap Donation Amount to ADD for " + name + ":");
  if (!amt) return;
  if (isNaN(amt)) { alert("Invalid number"); return; }
  
  window.showToast("Adding donation...", "success");
  const adminName = currentUser ? (idToNameMap[currentUser.gameId] || "Admin") : "Admin";
  try {
    const res = await fetch(`${API_BASE_URL}?api=addDonation&name=${encodeURIComponent(name)}&amount=${encodeURIComponent(amt)}&admin=${encodeURIComponent(adminName)}`).then(r => r.json());
    if (res.success) {
      window.showToast("Successfully added! New Total: " + res.newTotal, "success", true);
      window.sheetCache = {}; 
      if (document.getElementById('uniSearchInput')) {
        window.searchPlayerFull(name);
      } else {
        views.roster();
      }
    } else {
      alert("Error: " + res.message);
    }
  } catch (err) {
    alert("Network Error: " + err.message);
  }
};

// Close all admin dropdowns when clicking anywhere outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.admin-dropdown-menu') && !e.target.closest('button[onclick*="admin-dropdown-menu"]')) {
      document.querySelectorAll('.admin-dropdown-menu').forEach(d => d.style.display = 'none');
  }
});

const contactSidebarBtn = document.getElementById('contactSidebarBtn');
if (contactSidebarBtn) {
  contactSidebarBtn.addEventListener('click', () => {
    closeSidebarFunc();
    document.querySelectorAll('.nav-link, .sub-link').forEach(l => l.classList.remove('active'));
    if (views.contact) {
      window.activeViewFunc = () => views.contact();
      views.contact();
    }
  });
}



