import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Banner
banner_html = """    </nav>
    
    <div id="devDeployBanner" style="display:none; position:fixed; top:65px; left:0; width:100%; padding:12px; text-align:center; font-weight:bold; z-index:9000; box-shadow:0 4px 10px rgba(0,0,0,0.3); font-size:14px; animation: fadeIn 0.3s ease; box-sizing:border-box;"></div>
"""
content = content.replace('    </nav>', banner_html)

# Add Settings Section
settings_html = """        <div class="sidebar-section" style="margin-bottom:20px; background:var(--bg-main); padding:15px; border-radius:8px; border:1px solid var(--border);">
          <h3 style="margin-top:0; margin-bottom:10px; font-size:16px; color:var(--text-main); border-bottom:1px solid var(--border); padding-bottom:5px;">Developer Settings</h3>
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span style="color:var(--text-main); font-size:14px; font-weight:bold;">Dev Mode (Track Deployment)</span>
            <label style="position:relative; display:inline-block; width:40px; height:20px;">
              <input type="checkbox" id="devModeToggle" style="opacity:0; width:0; height:0;">
              <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:var(--border); transition:.4s; border-radius:20px;">
                <span id="devModeSlider" style="position:absolute; content:''; height:14px; width:14px; left:3px; bottom:3px; background-color:white; transition:.4s; border-radius:50%;"></span>
              </span>
            </label>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:8px; line-height:1.4;">
            When enabled, checks for active GitHub deployments and automatically refreshes the page when a new version goes live.
          </div>
        </div>
        
        <div class="sidebar-section" style="background:var(--bg-main); padding:15px; border-radius:8px; border:1px solid var(--border);">
          <h3 style="margin-top:0; margin-bottom:10px; font-size:16px; color:var(--text-main); border-bottom:1px solid var(--border); padding-bottom:5px;">Theme Engine</h3>"""

content = content.replace("""        <div class="sidebar-section" style="background:var(--bg-main); padding:15px; border-radius:8px; border:1px solid var(--border);">
          <h3 style="margin-top:0; margin-bottom:10px; font-size:16px; color:var(--text-main); border-bottom:1px solid var(--border); padding-bottom:5px;">Theme Engine</h3>""", settings_html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html")
