with open('main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# First, remove the global devModeToggle logic at the end of the file.
global_logic = """if (devModeToggle) {
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
}"""

content = content.replace(global_logic, """
// Auto start polling if dev mode is enabled on load
if (localStorage.getItem('devMode') === 'true') {
    checkDeploymentStatus();
    devModePollingInterval = setInterval(checkDeploymentStatus, 10000);
} else {
    checkDeploymentStatus();
}
""")

# Now add the binding into views.admin()
# Look for: // Bind delete avatar buttons
bind_logic = """
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
      
      // Bind delete avatar buttons"""

content = content.replace("// Bind delete avatar buttons", bind_logic)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(content)
