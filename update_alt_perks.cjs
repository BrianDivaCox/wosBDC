const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// 1. Add "Enable Perks" button to the Linked Alt accounts loop
content = content.replace(
    /onclick="window\.unlinkAltAccountPrompt\('\$\{gid\}'\)" style="background:transparent;/g,
    `onclick="window.unlinkAltAccountPrompt('\${gid}')" style="background:transparent;`
);

content = content.replace(
    /<button onclick="window\.unlinkAltAccountPrompt\('\$\{gid\}'\)" style="background:transparent; border:none; color:var\(--danger\); cursor:pointer; font-weight:bold; font-size:12px;">Unlink<\/button>/g,
    `<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
        <button onclick="window.openAltPerksModal('\${gid}', '\${altName.replace(/'/g, "\\'")}')" style="background:var(--success); border:none; color:var(--text-main); cursor:pointer; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:4px;">&#x1F381; Enable Perks</button>
        <button onclick="window.unlinkAltAccountPrompt('\${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:11px;">Unlink</button>
    </div>`
);

// 2. Add global function for modal + submit listener
const modalLogic = `
window.openAltPerksModal = (gameId, altName) => {
    const modal = document.getElementById('altPerksModal');
    const overlay = document.getElementById('altPerksModalOverlay');
    const nameInput = document.getElementById('altPerksName');
    const idInput = document.getElementById('altPerksGameId');
    const dateInput = document.getElementById('altPerksDateStarted');
    const errorMsg = document.getElementById('altPerksErrorMsg');
    const submitBtn = document.getElementById('altPerksSubmitBtn');
    
    if(!modal || !idInput) return;
    
    errorMsg.style.display = 'none';
    idInput.value = gameId;
    nameInput.value = (altName && !altName.startsWith('Game ID:')) ? altName : '';
    dateInput.value = '';
    submitBtn.textContent = 'Enroll Alt Account';
    submitBtn.disabled = false;
    
    modal.style.display = 'block';
    overlay.style.display = 'block';
    
    // Ensure we don't attach multiple event listeners
    submitBtn.replaceWith(submitBtn.cloneNode(true));
    document.getElementById('altPerksSubmitBtn').addEventListener('click', async () => {
        const btn = document.getElementById('altPerksSubmitBtn');
        const err = document.getElementById('altPerksErrorMsg');
        const cName = document.getElementById('altPerksName').value.trim();
        const cDate = document.getElementById('altPerksDateStarted').value;
        const gId = document.getElementById('altPerksGameId').value;
        
        if (!cName) {
            err.textContent = "Chief Name is required.";
            err.style.display = 'block';
            return;
        }
        
        try {
            btn.disabled = true;
            btn.textContent = "Enrolling...";
            
            const url = \`\${API_BASE_URL}?api=registerNewPlayer&gameId=\${encodeURIComponent(gId)}&name=\${encodeURIComponent(cName)}&dateStarted=\${encodeURIComponent(cDate)}\`;
            const res = await fetch(url).then(r => r.json());
            
            if (res && res.success) {
                if (res.status === 'duplicate_skipped') {
                    window.showToast("This Alt is already enrolled!", "success", true);
                } else {
                    window.showToast("Successfully Enrolled Alt Account!", "success", true);
                }
                document.getElementById('altPerksModal').style.display = 'none';
                document.getElementById('altPerksModalOverlay').style.display = 'none';
            } else {
                throw new Error("Backend error");
            }
        } catch (e) {
            err.textContent = "Failed to enroll Alt Account. Try again.";
            err.style.display = 'block';
            btn.disabled = false;
            btn.textContent = "Enroll Alt Account";
        }
    });
};
`;

content += '\n' + modalLogic;

fs.writeFileSync('main.js', content, 'utf8');
console.log("Updated main.js with Alt Perks logic");
