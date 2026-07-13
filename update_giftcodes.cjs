const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const oldGiftcodesView = `
    giftcodes: async () => {
      app.innerHTML = \`
        <div class="card" style="display:flex; flex-direction:column; height: 85vh; min-height: 800px; padding:0; overflow:hidden; animation: fadeIn 0.3s ease;">
          <div style="padding:15px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:10px;">
            <span style="font-size:24px;">dYZ?</span>
            <h2 style="margin:0; font-size:20px; color:var(--text-main);">Auto Redeem Sign-up</h2>
          </div>
          <div style="flex:1; width:100%; position:relative; background:var(--bg-main);">
            <iframe 
              src="https://forms.gle/zy4W2Fa1HDEr1hKBA" 
              style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;"
              frameborder="0" 
              marginheight="0" 
              marginwidth="0">
              Loading...
            </iframe>
          </div>
        </div>
      \`;
    },
`;

const newGiftcodesView = `
    giftcodes: async () => {
      let contentHtml = '';
      
      if (!currentUser) {
        contentHtml = \`
          <div style="text-align:center; padding:40px 20px;">
            <div style="font-size:48px; margin-bottom:20px;">o-</div>
            <h3 style="color:var(--text-main); margin-bottom:10px;">Sign In Required</h3>
            <p style="color:var(--text-muted); margin-bottom:25px; font-size:15px; line-height:1.5;">You must be signed into the Dashboard to securely enable Auto Redeem Perks.</p>
            <button onclick="document.getElementById('authModal').style.display='block'; document.getElementById('authModalOverlay').style.display='block';" style="background:var(--accent); color:#fff; border:none; padding:12px 24px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px;">Sign In / Register</button>
          </div>
        \`;
      } else {
        const chiefName = currentUser.name || idToNameMap[currentUser.gameId] || "Unknown Chief";
        contentHtml = \`
          <div style="text-align:center; padding:40px 20px;">
            <div style="font-size:48px; margin-bottom:20px;">dY"?</div>
            <h3 style="color:var(--text-main); margin-bottom:10px;">Enable Auto Redeem</h3>
            <p style="color:var(--text-muted); margin-bottom:25px; font-size:15px; line-height:1.5;">Welcome <strong>\${chiefName}</strong>! Click below to securely link your Game ID (\${currentUser.gameId}) to the Auto Redeem Bot. We will automatically fetch all new gift codes and inject them into your account!</p>
            <button id="optInPerksBtn" style="background:var(--success); color:var(--text-main); border:none; padding:14px 28px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px; transition:0.2s; box-shadow:0 4px 15px rgba(16,185,129,0.3);">1-Click Opt-In</button>
            <p style="margin-top:20px; font-size:13px; color:var(--text-muted);"><em>No double data entry needed. It's fully automated!</em></p>
          </div>
        \`;
      }

      app.innerHTML = \`
        <div class="card" style="display:flex; flex-direction:column; padding:0; overflow:hidden; animation: fadeIn 0.3s ease; max-width: 600px; margin: 40px auto;">
          <div style="padding:20px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:10px; justify-content:center; background:var(--bg-card);">
            <span style="font-size:24px;">dYZ?</span>
            <h2 style="margin:0; font-size:22px; color:var(--text-main);">Auto Redeem (Perks)</h2>
          </div>
          <div style="flex:1; width:100%; position:relative; background:var(--bg-main);">
            \${contentHtml}
          </div>
        </div>
      \`;
      
      // Attach Event Listener if the button exists
      const optInBtn = document.getElementById('optInPerksBtn');
      if (optInBtn) {
        optInBtn.addEventListener('click', async () => {
           if (!currentUser) return;
           optInBtn.disabled = true;
           optInBtn.textContent = 'Linking...';
           const chiefName = currentUser.name || idToNameMap[currentUser.gameId] || "Unknown Chief";
           try {
               const url = \`\${API_BASE_URL}?api=registerNewPlayer&gameId=\${encodeURIComponent(currentUser.gameId)}&name=\${encodeURIComponent(chiefName)}\`;
               const res = await fetch(url).then(r => r.json());
               
               if (res && res.success) {
                   if (res.status === 'duplicate_skipped') {
                       window.showToast("You are already enrolled!", "success", true);
                   } else {
                       window.showToast("Successfully Enrolled in Auto Redeem!", "success", true);
                   }
                   optInBtn.textContent = 'Enrolled o.';
                   optInBtn.style.background = 'var(--bg-card)';
                   optInBtn.style.border = '1px solid var(--success)';
               } else {
                   throw new Error("Failed to link account");
               }
           } catch(e) {
               console.error(e);
               window.showToast("Error linking account. Try again later.", "error");
               optInBtn.disabled = false;
               optInBtn.textContent = '1-Click Opt-In';
           }
        });
      }
    },
`;

let replaced = false;
content = content.replace(/giftcodes:\s*async\s*\(\)\s*=>\s*\{[\s\S]*?\},/m, (match) => {
    replaced = true;
    return newGiftcodesView.trim();
});

if (!replaced) {
    console.log("Regex failed to find giftcodes view.");
} else {
    fs.writeFileSync('main.js', content, 'utf8');
    console.log("Updated giftcodes view in main.js");
}
