with open('main.js', 'r', encoding='utf-8') as f:
    content = f.read()

start_str = "// --- GitHub Deployment Tracker ---"
end_str = "document.head.appendChild(style);"

start_idx = content.find(start_str)
end_idx = content.find(end_str, start_idx) + len(end_str)

new_logic = """// --- Dev Mode Deployment Tracker ---
const devModeToggle = document.getElementById('devModeToggle');
const devDeployBanner = document.getElementById('devDeployBanner');
const devModeSlider = document.getElementById('devModeSlider');
const statusEl = document.getElementById('github-deploy-status');
let devModePollingInterval = null;
let lastDeployStatus = null;

const checkDeploymentStatus = async () => {
  if (!statusEl) return;
  try {
    const res = await fetch('https://api.github.com/repos/BrianDivaCox/wosBDC/actions/runs?branch=main&per_page=1');
    const data = await res.json();
    if (data && data.workflow_runs && data.workflow_runs.length > 0) {
      const latestRun = data.workflow_runs[0];
      const status = latestRun.status;
      const conclusion = latestRun.conclusion;
      
      const isDevMode = localStorage.getItem('devMode') === 'true';
      
      if (status === 'in_progress' || status === 'queued') {
        statusEl.innerHTML = `<span style="color:#eab308; display:flex; align-items:center; gap:5px;"><span style="display:inline-block; animation: spin 2s linear infinite;">⏳</span> Building & Deploying...</span>`;
        if (isDevMode && devDeployBanner) {
            devDeployBanner.style.display = 'block';
            devDeployBanner.style.backgroundColor = '#f59e0b';
            devDeployBanner.style.color = '#fff';
            devDeployBanner.innerHTML = '🚀 Deployment in progress... Auto-refresh enabled.';
            lastDeployStatus = 'in_progress';
        }
      } else if (status === 'completed' && conclusion === 'success') {
        statusEl.innerHTML = `<span style="color:var(--success);">✅ Live & Up to Date</span>`;
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
        statusEl.innerHTML = `<span style="color:var(--danger);">❌ Deployment Failed</span>`;
      } else {
        statusEl.innerHTML = `<span style="color:var(--text-muted);">Status: ${status}</span>`;
      }
    } else if (data && data.message && data.message.includes('rate limit')) {
      statusEl.innerHTML = `<span style="color:var(--danger);">⚠️ GitHub API Rate Limited. Please wait.</span>`;
    }
  } catch (err) {
    statusEl.innerHTML = `<span style="color:var(--danger);">Error fetching status</span>`;
  }
};

if (devModeToggle) {
  const isDevMode = localStorage.getItem('devMode') === 'true';
  devModeToggle.checked = isDevMode;
  if (isDevMode && devModeSlider) {
    devModeSlider.style.transform = 'translateX(20px)';
  }
  
  if (isDevMode) {
    checkDeploymentStatus();
    devModePollingInterval = setInterval(checkDeploymentStatus, 10000);
  }
  
  devModeToggle.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    localStorage.setItem('devMode', enabled);
    if (devModeSlider) {
      devModeSlider.style.transform = enabled ? 'translateX(20px)' : 'translateX(0)';
    }
    
    if (enabled) {
      checkDeploymentStatus();
      devModePollingInterval = setInterval(checkDeploymentStatus, 10000);
    } else {
      if (devModePollingInterval) clearInterval(devModePollingInterval);
      if (devDeployBanner) devDeployBanner.style.display = 'none';
    }
  });
}

// Check once on load if not dev mode (dev mode already checks)
if (localStorage.getItem('devMode') !== 'true') {
    checkDeploymentStatus();
}
// Also check when the user opens the sidebar
const settingsBtnEl = document.getElementById('settingsBtn');
if (settingsBtnEl) settingsBtnEl.addEventListener('click', checkDeploymentStatus);

// Add spinning animation for the loader
const style = document.createElement('style');
style.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(style);"""

content = content[:start_idx] + new_logic + content[end_idx:]

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(content)
