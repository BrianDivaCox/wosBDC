const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const modalHtml = `
    <!-- Alt Perks Modal -->
    <div id="altPerksModalOverlay" class="sidebar-overlay"></div>
    <div id="altPerksModal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:var(--card-bg); padding:30px; border-radius:12px; border:1px solid var(--border); box-shadow:0 10px 25px rgba(0,0,0,0.5); z-index:1001; width:90%; max-width:400px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h2 style="margin:0; color:var(--text-main);">&#x1F381; Enroll Alt in Perks</h2>
        <button onclick="document.getElementById('altPerksModal').style.display='none'; document.getElementById('altPerksModalOverlay').style.display='none';" class="close-btn">&times;</button>
      </div>
      
      <div id="altPerksErrorMsg" style="color:var(--danger); font-size:13px; margin-bottom:15px; display:none;"></div>
      
      <label style="color:var(--text-muted); font-size:13px; display:block; margin-bottom:5px;">Chief Name</label>
      <input type="text" id="altPerksName" placeholder="Chief Name" style="width:100%; padding:10px; margin-bottom:15px; border-radius:6px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); box-sizing:border-box;">
      
      <label style="color:var(--text-muted); font-size:13px; display:block; margin-bottom:5px;">Game ID (Locked)</label>
      <input type="number" id="altPerksGameId" readonly style="width:100%; padding:10px; margin-bottom:15px; border-radius:6px; border:1px solid var(--border); background:rgba(0,0,0,0.2); color:var(--text-muted); box-sizing:border-box; cursor:not-allowed;">
      
      <label style="color:var(--text-muted); font-size:13px; display:block; margin-bottom:5px;">Date Started</label>
      <input type="date" id="altPerksDateStarted" style="width:100%; padding:10px; margin-bottom:20px; border-radius:6px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); box-sizing:border-box;">
      
      <button id="altPerksSubmitBtn" style="width:100%; padding:12px; background:var(--success); color:var(--text-main); border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Enroll Alt Account</button>
    </div>
    
    <!-- Admin Banner -->
`;

content = content.replace('    <!-- Admin Banner -->', modalHtml.trim() + '\n    <!-- Admin Banner -->');

fs.writeFileSync('index.html', content, 'utf8');
console.log("Updated index.html");
