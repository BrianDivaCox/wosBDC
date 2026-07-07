with open('main.js', 'r', encoding='utf-8') as f:
    content = f.read()

admin_dev_mode_html = """
          <!-- Developer Settings (Dev Mode Tracker) -->
          <div style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--accent); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h3 style="margin:0; color:var(--text-main);">Dev Mode (Track Deployment)</h3>
              <p style="margin:5px 0 0 0; font-size:12px; color:var(--text-muted);">When enabled, checks for active GitHub deployments and auto-refreshes the page.</p>
            </div>
            <label style="position:relative; display:inline-block; width:40px; height:20px; flex-shrink:0;">
              <input type="checkbox" id="devModeToggleAdmin" style="opacity:0; width:0; height:0;">
              <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:var(--border); transition:.4s; border-radius:20px;">
                <span id="devModeSliderAdmin" style="position:absolute; content:''; height:14px; width:14px; left:3px; bottom:3px; background-color:white; transition:.4s; border-radius:50%;"></span>
              </span>
            </label>
          </div>
"""

# Insert the HTML into views.admin after Maintenance Mode Toggle
target = "          <!-- Universal Player Editor -->"
content = content.replace(target, admin_dev_mode_html + target)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(content)
