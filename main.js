import './style.css'
import { initPresence, listenToAuth, loginUser, logoutUser, registerUser, uploadAvatar, deleteAvatar, db } from './src/firebase.js'
import { ref, onValue, get, set } from 'firebase/database'

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxpvuesjr19OFhqIY1JtFMqHee6I4YKLkEDqTCVNGDxkMyyfm1b5wLiIVXtbn6vjBg/exec';

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
  
  // Highlight the active circle
  document.querySelectorAll('.theme-option').forEach(option => {
    const circle = option.querySelector('.theme-circle');
    if (circle && circle.getAttribute('data-theme') === savedTheme) {
      circle.classList.add('active');
    } else if (circle) {
      circle.classList.remove('active');
    }
  });
};

document.querySelectorAll('.theme-option').forEach(option => {
  option.addEventListener('click', () => {
    const circle = option.querySelector('.theme-circle');
    if(!circle) return;
    
    const theme = circle.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update active circle
    document.querySelectorAll('.theme-circle').forEach(c => c.classList.remove('active'));
    circle.classList.add('active');
    
    // Auto-close sidebar to see changes
    closeSidebarFunc();
  });
});

initTheme();

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

const adminSidebarBtn = document.getElementById('adminSidebarBtn');

// Listen to Auth State
listenToAuth((user) => {
  currentUser = user;
  if (user) {
    if(authSidebarBtn) authSidebarBtn.innerHTML = `👤 ${idToNameMap[user.gameId] || 'Account'}`;
    if(adminSidebarBtn && user.gameId === 318843189) {
      adminSidebarBtn.style.display = 'block';
    } else if (adminSidebarBtn) {
      adminSidebarBtn.style.display = 'none';
    }
    // If they are on the home page, maybe reload or show a toast
    if (app.querySelector('#accountHubView')) views.account(); // Refresh account view if open
  } else {
    if(authSidebarBtn) authSidebarBtn.innerHTML = `🔐 Sign In / Register`;
    if(adminSidebarBtn) adminSidebarBtn.style.display = 'none';
    if (app.querySelector('#accountHubView') || app.querySelector('#adminHubView')) views.home(); // Kick to home
  }
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
    authModalTitle.textContent = 'Register';
    authGameId.style.display = 'block';
    authSubmitBtn.textContent = 'Create Account';
    authToggleText.textContent = 'Already have an account?';
    authToggleBtn.textContent = 'Sign In';
  } else {
    authModalTitle.textContent = 'Sign In';
    authGameId.style.display = 'none';
    authSubmitBtn.textContent = 'Sign In';
    authToggleText.textContent = 'Need an account?';
    authToggleBtn.textContent = 'Register';
  }
});

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
    } else {
      await loginUser(email, password);
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


// --- Routing & Views ---
const app = document.getElementById('app');
const navLinks = document.querySelectorAll('.nav-link');

const renderLoading = (message) => {
  app.innerHTML = `<div class="card"><div class="loading">⏳ ${message}...</div></div>`;
};

const renderError = (err) => {
  app.innerHTML = `<div class="card"><div class="loading" style="color:var(--danger)">❌ Error: ${err}</div></div>`;
};

// Data Fetcher
const fetchSheet = async (sheetName) => {
  try {
    const res = await fetch(`${API_BASE_URL}?api=${encodeURIComponent(sheetName)}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json.data;
  } catch(err) {
    throw err;
  }
};

// Immediately fetch mapping data to ensure auth UI is populated
fetchSheet("Chief's List").then(rosterRawData => {
  if (rosterRawData && rosterRawData.length > 0) {
    for (let i = 1; i < rosterRawData.length; i++) {
      let name = rosterRawData[i][0];
      let id = rosterRawData[i][1];
      if (name && id) {
         idToNameMap[id] = name.toString().trim();
         nameToIdMap[name.toString().trim()] = id;
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

// --- GitHub Deployment Tracker ---
const checkDeploymentStatus = async () => {
  const statusEl = document.getElementById('github-deploy-status');
  if (!statusEl) return;
  try {
    const res = await fetch('https://api.github.com/repos/BrianDivaCox/wosBDC/actions/runs?per_page=1');
    const data = await res.json();
    if (data && data.workflow_runs && data.workflow_runs.length > 0) {
      const latestRun = data.workflow_runs[0];
      const status = latestRun.status;
      const conclusion = latestRun.conclusion;
      
      if (status === 'in_progress' || status === 'queued') {
        statusEl.innerHTML = `<span style="color:#eab308; display:flex; align-items:center; gap:5px;"><span style="display:inline-block; animation: spin 2s linear infinite;">⏳</span> Building & Deploying...</span>`;
      } else if (status === 'completed' && conclusion === 'success') {
        statusEl.innerHTML = `<span style="color:var(--success);">✅ Live & Up to Date</span>`;
      } else if (status === 'completed' && conclusion === 'failure') {
        statusEl.innerHTML = `<span style="color:var(--danger);">❌ Deployment Failed</span>`;
      } else {
        statusEl.innerHTML = `<span style="color:var(--text-muted);">Status: ${status}</span>`;
      }
    }
  } catch (err) {
    statusEl.innerHTML = `<span style="color:var(--danger);">Error fetching status</span>`;
  }
};
// Check immediately and then every 30 seconds
checkDeploymentStatus();
setInterval(checkDeploymentStatus, 30000);

// Add spinning animation for the loader
const style = document.createElement('style');
style.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(style);

// View renderers
const views = {
  admin: async () => {
    if (!currentUser || currentUser.gameId !== 318843189) {
      views.home();
      return;
    }
    
    renderLoading("Loading Admin Panel");
    try {
      const usersSnap = await get(ref(db, 'users'));
      const users = usersSnap.val() || {};
      
      let html = `
        <div class="card" style="max-width:800px; margin:0 auto; animation: fadeIn 0.3s ease;">
          <h2 style="color:var(--danger); margin-top:0;">🛡️ Admin Control Panel</h2>
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
        const avatarSrc = avatarMap[u.gameId] || `/images/${cName}.png`;
        
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
      
      html += `</tbody></table></div></div></div>`;
      app.innerHTML = html;
      
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
      
    } catch(err) {
      renderError(err.message);
    }
  },
  
  account: async () => {
    if (!currentUser) {
      views.home();
      return;
    }
    
    let currentChiefName = idToNameMap[currentUser.gameId] || `Game ID: ${currentUser.gameId}`;
    
    app.innerHTML = `
      <div id="accountHubView" class="card" style="max-width:600px; margin:0 auto; text-align:center;">
        <h2 style="color:var(--text-main); margin-top:0;">Account Hub</h2>
        <div style="background:var(--bg-main); padding:20px; border-radius:12px; border:1px solid var(--border); margin-bottom:20px;">
          <div style="font-size:18px; font-weight:bold; color:var(--accent); margin-bottom:10px;">👤 ${currentChiefName}</div>
          <div style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">${currentUser.email}</div>
          
          <div style="text-align:left; border-top:1px solid var(--border); padding-top:20px; margin-top:20px;">
            <h3 style="margin-top:0; color:var(--text-main); font-size:16px;">🖼️ Profile Picture</h3>
            <p style="color:var(--text-muted); font-size:13px; margin-bottom:15px;">Upload a custom profile picture. It will automatically replace your default avatar on the Chief's Roster and Leaderboards.</p>
            
            <input type="file" id="avatarUploadInput" accept="image/png, image/jpeg, image/webp" style="display:none;">
            <button id="avatarUploadBtn" style="background:var(--bg-main); border:1px solid var(--accent); color:var(--text-main); padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold; transition:0.2s;">Choose Image</button>
            
            <div id="avatarUploadStatus" style="margin-top:10px; font-size:13px; color:var(--success); font-weight:bold;"></div>
          </div>
        </div>
        
        <button id="logoutBtn" style="background:transparent; border:1px solid var(--danger); color:var(--danger); padding:8px 16px; border-radius:8px; cursor:pointer; font-weight:bold;">Sign Out</button>
      </div>
    `;
    
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await logoutUser();
      views.home();
    });
    
    const uploadInput = document.getElementById('avatarUploadInput');
    const uploadBtn = document.getElementById('avatarUploadBtn');
    const statusMsg = document.getElementById('avatarUploadStatus');
    
    uploadBtn.addEventListener('click', () => uploadInput.click());
    
    uploadInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        uploadBtn.textContent = 'Uploading... 0%';
        uploadBtn.disabled = true;
        statusMsg.style.color = 'var(--text-muted)';
        statusMsg.textContent = 'Preparing upload...';
        
        await uploadAvatar(currentUser.gameId, file, (progress) => {
          const percent = Math.round(progress);
          uploadBtn.textContent = `Uploading... ${percent}%`;
          statusMsg.textContent = `Uploading: ${percent}%`;
        });
        
        statusMsg.style.color = 'var(--success)';
        statusMsg.textContent = '✅ Profile picture updated successfully!';
        uploadBtn.textContent = 'Choose Image';
        uploadBtn.disabled = false;
        
        // Refresh mapping so UI updates immediately
        if (idToNameMap[currentUser.gameId]) {
           avatarMap[currentUser.gameId] = await get(ref(db, `avatars/${currentUser.gameId}`)).then(s => s.val());
        }
      } catch (err) {
        statusMsg.style.color = 'var(--danger)';
        statusMsg.textContent = `❌ Upload failed: ${err.message}`;
        uploadBtn.textContent = 'Try Again';
        uploadBtn.disabled = false;
      }
    });
  },

  home: async () => {
    renderLoading('Loading Home & News');
    try {
      const data = await fetchSheet('News');
      
      let currentMode = 'cards'; // Default to cards
      
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
          if (currentMode === 'table') {
            contentHtml += `<table style="table-layout:fixed; width:100%;"><thead><tr><th>Announcement</th></tr></thead><tbody>`;
            for(let i=0; i<newsItems.length; i++){
              contentHtml += `<tr><td style="white-space:normal; word-wrap:break-word;">${newsItems[i]}</td></tr>`;
            }
            contentHtml += `</tbody></table>`;
          } else {
            // Card mode
            contentHtml += `<div style="display:flex; flex-direction:column; gap:15px; animation: fadeIn 0.3s ease;">`;
            for(let i=0; i<newsItems.length; i++){
              contentHtml += `
                <div style="background:var(--bg-main); border:1px solid var(--border); border-radius:8px; padding:20px; display:flex; gap:20px; align-items:flex-start; box-shadow:0 4px 6px rgba(0,0,0,0.05); transition:transform 0.2s;">
                  <div style="background:rgba(168,85,247,0.1); color:var(--accent); width:45px; height:45px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0;">
                    📢
                  </div>
                  <div style="width:100%; overflow:hidden;">
                    <div style="font-weight:bold; color:var(--text-main); font-size:18px; margin-bottom:8px;">Alliance Notice</div>
                    <div style="color:var(--text-muted); font-size:15px; line-height:1.6; white-space:pre-wrap; word-break:break-word;">${newsItems[i]}</div>
                  </div>
                </div>
              `;
            }
            contentHtml += `</div>`;
          }
        }
        return contentHtml;
      };

      let headerHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h2 style="margin:0; color:var(--text-main); font-size:24px;">📰 Alliance News</h2>
        </div>
      `;
      
      app.innerHTML = headerHtml + `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; flex-wrap:wrap; gap:15px; border-bottom:1px solid var(--border); padding-bottom:15px;">
            <div class="card-title" style="margin:0;">Recent Updates</div>
            <button id="newsToggleBtn" style="background:var(--bg-main); border:1px solid var(--accent); color:var(--accent); padding:8px 16px; border-radius:20px; cursor:pointer; font-size:13px; font-weight:bold; transition:all 0.2s; display:flex; align-items:center; gap:8px;">
              ${currentMode === 'table' ? '🎴 Switch to Card View' : '📊 Switch to Table View'}
            </button>
          </div>
          <div id="newsContentContainer">
            ${renderNewsContent()}
          </div>
        </div>
      `;
      
      document.getElementById('newsToggleBtn').addEventListener('click', (e) => {
        currentMode = currentMode === 'table' ? 'cards' : 'table';
        e.target.innerHTML = currentMode === 'table' ? '🎴 Switch to Card View' : '📊 Switch to Table View';
        document.getElementById('newsContentContainer').innerHTML = renderNewsContent();
      });
      
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

      html += `<div style="display:flex; flex-wrap:wrap; gap:20px;">`;
      
      boards.forEach(board => {
        html += `<div class="card" style="flex: 1; min-width: 320px;"><div class="card-title">🏆 ${board.title}</div>`;
        html += `<table><thead><tr>`;
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
            
            // Inject avatar if it's the Name column (idx 1)
            let formattedCell = formatCell(cell);
            if (idx === 1) {
               let pName = (cell || "").toString().trim();
               if (pName) {
                 let playerGameId = nameToIdMap[pName];
                 let tryUrl = (playerGameId && avatarMap[playerGameId]) ? avatarMap[playerGameId] : `/images/${pName}.png`;
                 let avatarHtml = `
                   <div style="display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; border-radius:50%; background:var(--accent); color:#fff; font-size:10px; font-weight:bold; margin-right:8px; overflow:hidden; vertical-align:middle; flex-shrink:0;">
                     <img src="${tryUrl}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <div style="display:none; width:100%; height:100%; align-items:center; justify-content:center;">${pName.charAt(0).toUpperCase()}</div>
                   </div>`;
                 formattedCell = `<div style="display:flex; align-items:center;">${avatarHtml}${formattedCell}</div>`;
               }
            }
            
            html += `<td ${idx === 0 ? 'style="font-weight:bold; color:var(--text-muted);"' : ''}>${formattedCell}</td>`;
          });
          html += `</tr>`;
        });
        
        html += `</tbody></table></div>`;
      });
      
      html += `</div>`;
      app.innerHTML = html;
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
      
      let html = `<div class="card" style="margin-bottom:20px; text-align:center;">
                    <div class="card-title" style="margin-bottom:15px; font-size:24px;">🔍 Player Lookup</div>
                    <select id="playerLookupSelect" style="width:100%; max-width:400px; padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); font-size:16px; font-weight:bold; cursor:pointer;">
                      <option value="">-- Select a Chief --</option>
                      ${players.map((p, i) => `<option value="${i}">${p[0]}</option>`).join('')}
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
      
      select.addEventListener('change', (e) => {
        const idx = e.target.value;
        if (idx === "") {
          container.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:40px; font-size:16px;">Select a player to view their activity profile.</div>`;
          return;
        }
        
        const p = players[idx];
        const chiefName = p[0].toString().trim();
        
        // Lookup Roster Info
        let rosterInfo = rosterMap[chiefName];
        let headerBadgesHtml = ``;
        if (rosterInfo) {
          // Format gift codes checkmark
          let gcVal = rosterInfo.giftCodes;
          let gcDisplay = "❌"; // Default to red X if they are not signed up (missing or false)
          
          if (gcVal !== undefined && gcVal !== null && gcVal !== "") {
            let strVal = gcVal.toString().toLowerCase().trim();
            if (gcVal === true || strVal === "true" || strVal === "✓" || strVal === "yes") {
              gcDisplay = "✅";
            } else if (gcVal === false || strVal === "false" || strVal === "✗" || strVal === "no") {
              gcDisplay = "❌";
            } else {
              gcDisplay = gcVal; // Fallback for weird strings
            }
          }
          
          let taVal = rosterInfo.timeActive;
          if (taVal === undefined || taVal === null || taVal.toString().trim() === "") taVal = "N/A";
          
          headerBadgesHtml = `
            <div style="display:flex; gap:10px; margin-top:8px; flex-wrap:wrap;">
              <span style="background:var(--bg-main); border:1px solid var(--border); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🎁 Gift Codes: ${gcDisplay}</span>
              <span style="background:var(--bg-main); border:1px solid var(--border); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">⏱️ Active: ${taVal}</span>
            </div>
          `;
        }
        
        // Add Activity Streaks & Event Badges
        let activityBadges = ``;
        let missedDays = p[1];
        if (showdownActive) {
          if (missedDays === undefined || missedDays === null || missedDays.toString().trim() === "" || missedDays === 0 || missedDays === "0") {
             activityBadges += `<span style="background:color-mix(in srgb, #f97316 15%, transparent); border:1px solid #f97316; color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🔥 Perfect Attendance</span>`;
          }
        }
        
        const isTrue = (val) => val === true || (typeof val === 'string' && val.toLowerCase().trim() === 'true');
        
        if (isTrue(p[2])) {
           activityBadges += `<span style="background:color-mix(in srgb, #fbbf24 15%, transparent); border:1px solid #fbbf24; color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🏆 Championship</span>`;
        }
        if (isTrue(p[3])) {
           activityBadges += `<span style="background:color-mix(in srgb, #ef4444 15%, transparent); border:1px solid #ef4444; color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🛡️ Mercenary</span>`;
        }
        if (isTrue(p[4])) {
           activityBadges += `<span style="background:color-mix(in srgb, #38bdf8 15%, transparent); border:1px solid #38bdf8; color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">❄️ Polar Terrors</span>`;
        }
        
        if (activityBadges) {
           headerBadgesHtml += `<div style="display:flex; gap:10px; margin-top:8px; flex-wrap:wrap;">${activityBadges}</div>`;
        }
        
        // Add Leaderboard Badges if they exist
        let lbData = lbMap[chiefName];
        let dynamicSD = allTimeRankingsMap[chiefName];
        
        if ((lbData && lbData.length > 0) || dynamicSD) {
          headerBadgesHtml += `<div style="display:flex; gap:10px; margin-top:8px; flex-wrap:wrap;">`;
          
          if (dynamicSD) {
            headerBadgesHtml += `<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">⚔️ All-Time Showdown Rank #${dynamicSD.rank}: <span style="color:var(--text-main);">${dynamicSD.score.toLocaleString()}</span></span>`;
          }
          
            if (lbData) {
              let bear1, bear2, bearBoth;
              let btDonationsCurrent, btDonationsAllTime;
              let otherLbs = [];
              
              lbData.forEach(lb => {
                if (lb.title.toLowerCase().includes('all-time showdown')) return; // Skip old static one
                
                let t = lb.title.toLowerCase();
                if (t.includes('bear trap 1')) bear1 = lb.score;
                else if (t.includes('bear trap 2')) bear2 = lb.score;
                else if (t.includes('both bear trap')) bearBoth = lb.score;
                else if (t.includes('all-time bear donations')) btDonationsAllTime = lb;
                else if (t.includes('bear donations')) btDonationsCurrent = lb;
                else {
                  otherLbs.push(lb);
                }
              });
              
              if (bear1 || bear2 || bearBoth) {
                 let innerText = "";
                 if (bearBoth && bear1 && bear2) innerText = `${bearBoth} Total (T1: ${bear1} | T2: ${bear2})`;
                 else if (bear1 && bear2) innerText = `T1: ${bear1} | T2: ${bear2}`;
                 else if (bearBoth) innerText = `${bearBoth} Total`;
                 else if (bear1) innerText = `T1: ${bear1}`;
                 else if (bear2) innerText = `T2: ${bear2}`;
                 
                 headerBadgesHtml += `<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🐻 Bear Trap Wins: <span style="color:var(--text-main);">${innerText}</span></span>`;
              }
              if (btDonationsCurrent || btDonationsAllTime) {
                 let allTimeStr = btDonationsAllTime ? `#${btDonationsAllTime.rank} (${btDonationsAllTime.score}) All-Time` : `0 All-Time`;
                 
                 let currentScoreStr = 0;
                 if (btDonationsCurrent) {
                     currentScoreStr = `#${btDonationsCurrent.rank} (${btDonationsCurrent.score})`;
                 }
                 let currentStr = `${currentScoreStr} Current`;
                 
                 let innerText = `${allTimeStr} | ${currentStr}`;
                 
                 headerBadgesHtml += `<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🍯 BT Donations: <span style="color:var(--text-main);">${innerText}</span></span>`;
              }
              
              otherLbs.forEach(lb => {
                headerBadgesHtml += `<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">${lb.emoji} ${lb.title}: <span style="color:var(--text-main);">${lb.score}</span></span>`;
              });
            }
          headerBadgesHtml += `</div>`;
        }
        
        // Generate Metric Cards for columns B to G (index 1 to 6)
        let metricsHtml = `
          <div style="margin-top: 25px;">
            <h3 style="margin: 0 0 5px 0; color:var(--text-main); font-size:16px; border-bottom:1px solid var(--border); padding-bottom:8px;">📅 Events Checklist</h3>
            <p style="font-size:11px; color:var(--text-muted); margin:0 0 15px 0;">✅ = Participated / Done <span style="margin:0 5px;">|</span> ❌ = Action Required <span style="margin:0 5px;">|</span> ⏳ = Upcoming</p>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:15px;">
        `;
        
        for (let col = 1; col < headers.length; col++) {
          let header = headers[col] || `Metric ${col}`;
          
          // Skip showing BT Donations in the checklist boxes (it's in the tag above)
          if (header.toLowerCase().includes("bt donation")) continue;
          
          let val = p[col];
          
          // Format Checkmarks and empty values
          if (val === undefined || val === null || val.toString().trim() === "") {
            val = "<span style='color:var(--text-muted);'>-</span>";
          } else {
            let strVal = val.toString().toLowerCase().trim();
            if (val === true || strVal === "true" || strVal === "✓" || strVal === "yes") {
              val = "✅";
            } else if (val === false || strVal === "false" || strVal === "✗" || strVal === "no") {
              val = colIsUpcoming[col] ? "⏳" : "❌";
            }
          }
          
          metricsHtml += `
            <div style="background:var(--bg-main); border:1px solid var(--border); border-radius:8px; padding:15px; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.05); transition:transform 0.2s;">
              <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; font-weight:bold;">${header}</div>
              <div style="font-size:18px; font-weight:bold; color:var(--text-main);">${val}</div>
            </div>
          `;
        }
        metricsHtml += `</div></div>`;
        
        let avatarImgHtml = `${chiefName.charAt(0).toUpperCase()}`;
        let playerGameId = nameToIdMap[chiefName];
        let tryUrl = (playerGameId && avatarMap[playerGameId]) ? avatarMap[playerGameId] : `/images/${chiefName}.png`;
        
        avatarImgHtml = `
          <img src="${tryUrl}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div style="display:none; align-items:center; justify-content:center; width:100%; height:100%;">${chiefName.charAt(0).toUpperCase()}</div>
        `;
        
        container.innerHTML = `
          <div class="card" style="animation: fadeIn 0.3s ease;">
            <div style="display:flex; align-items:flex-start; gap:15px; border-bottom:1px solid var(--border); padding-bottom:15px;">
              <div style="width:50px; height:50px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center; font-size:24px; color:#fff; font-weight:bold; flex-shrink:0; overflow:hidden;">
                ${avatarImgHtml}
              </div>
              <div style="overflow:hidden;">
                <h2 style="margin:0; color:var(--text-main); font-size:22px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; line-height:1.2;">${chiefName}</h2>
                <div style="color:var(--text-muted); font-size:13px; margin-top:2px;">BDC Alliance Member</div>
                ${headerBadgesHtml}
              </div>
            </div>
            ${metricsHtml}
          </div>
        `;
      });
      
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
    renderLoading("Loading Schedule");
    try {
      const data = await fetchSheet("schedule");
      
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
          let d = new Date(cell);
          let formatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          days.push({ dateStr: formatted, colIdx: c, categories: {} });
        }
      }
      
      // Extract events for each day, grouping by category
      let currentCategory = "Events";
      for (let r = dateRowIdx + 1; r < data.length; r++) {
        if (data[r].every(cell => cell === "")) continue;
        
        // Detect category headers (e.g. "Events", "Rewards Events")
        let nonEmptyCells = data[r].filter(c => c !== "");
        if (nonEmptyCells.length === 1 && typeof nonEmptyCells[0] === 'string' && nonEmptyCells[0].toLowerCase().includes('event')) {
          currentCategory = nonEmptyCells[0];
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
                    <h2 style="color:var(--text-main); margin:0;">📅 Event Schedule</h2>
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
          
          if (eventDate < now) isPast = true;
          
          let isToday = (eventDate.getDate() === now.getDate() && eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear());
          if (isToday) {
            currentCategory = "today";
          } else {
            currentCategory = "upcoming";
          }
          
          dateVal = (eventDate.getMonth()+1) + '/' + eventDate.getDate();
        } else if (dateVal === undefined) { dateVal = ""; }
        
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
        } else if (utcVal === undefined) { utcVal = ""; }
        
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
function updateGlobalTimers() {
  const now = new Date();
  
  // UTC Clock
  const utcClockEl = document.getElementById('utc-clock');
  if (utcClockEl) {
    let h = now.getUTCHours().toString().padStart(2, '0');
    let m = now.getUTCMinutes().toString().padStart(2, '0');
    let s = now.getUTCSeconds().toString().padStart(2, '0');
    utcClockEl.textContent = `${h}:${m}:${s}`;
  }
  
  // Local Clock
  const localClockEl = document.getElementById('local-clock');
  if (localClockEl) {
    localClockEl.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
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
    // Exclude the Theme Settings link since it handles itself
    if (e.target.id === 'mobileSettingsBtn') return;
    
    e.preventDefault();
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    // If it's a sub-link in a dropdown, highlight the parent nav-link
    if (e.target.classList.contains('sub-link')) {
      e.target.closest('.dropdown').querySelector('.nav-link').classList.add('active');
    } else {
      e.target.classList.add('active');
    }
    
    // Auto-close the hamburger menu if it's open
    if (mobileMenu) mobileMenu.classList.remove('open');
    
    const target = e.target.getAttribute('data-target');
    const filter = e.target.getAttribute('data-filter');
    if (views[target]) views[target](filter);
  });
});

// Initial load
views.home();
initPresence();
