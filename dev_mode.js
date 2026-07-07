
// --- Dev Mode Deployment Tracker ---
const devModeToggle = document.getElementById('devModeToggle');
const devDeployBanner = document.getElementById('devDeployBanner');
const devModeSlider = document.getElementById('devModeSlider');
let devModePollingInterval = null;
let lastDeployStatus = null;

const checkDeploymentStatus = async () => {
  try {
    const res = await fetch('https://api.github.com/repos/BrianDivaCox/wosBDC/actions/runs?branch=main&per_page=1');
    const data = await res.json();
    if (data.workflow_runs && data.workflow_runs.length > 0) {
      const run = data.workflow_runs[0];
      if (run.status === 'in_progress' || run.status === 'queued') {
        devDeployBanner.style.display = 'block';
        devDeployBanner.style.backgroundColor = '#f59e0b'; // amber/warning
        devDeployBanner.style.color = '#fff';
        devDeployBanner.innerHTML = '🚀 Deployment in progress... Auto-refresh enabled.';
        lastDeployStatus = 'in_progress';
      } else if (run.status === 'completed' && run.conclusion === 'success') {
        if (lastDeployStatus === 'in_progress') {
          // A deployment just finished!
          window.location.reload(true);
        } else {
          devDeployBanner.style.display = 'block';
          devDeployBanner.style.backgroundColor = '#10b981'; // green/success
          devDeployBanner.style.color = '#fff';
          devDeployBanner.innerHTML = '🟢 Live and up to date.';
          lastDeployStatus = 'completed';
        }
      }
    }
  } catch (e) {
    console.warn("Dev mode tracking failed", e);
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
      devDeployBanner.style.display = 'none';
    }
  });
}
