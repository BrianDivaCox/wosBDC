const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const targetStr = "const uploadInput = document.getElementById('avatarUploadInput');";
const listeners = `
      const openLinkAltBtn = document.getElementById('openLinkAltBtn');
      const linkAltForm = document.getElementById('linkAltForm');
      const altGameIdInput = document.getElementById('altGameIdInput');
      const altChiefConfirm = document.getElementById('altChiefConfirm');
      const cancelAltBtn = document.getElementById('cancelAltBtn');
      const submitAltBtn = document.getElementById('submitAltBtn');
      
      if (openLinkAltBtn) {
          openLinkAltBtn.addEventListener('click', () => {
              openLinkAltBtn.style.display = 'none';
              linkAltForm.style.display = 'block';
              altGameIdInput.value = '';
              altChiefConfirm.style.display = 'none';
          });
          
          cancelAltBtn.addEventListener('click', () => {
              openLinkAltBtn.style.display = 'block';
              linkAltForm.style.display = 'none';
          });
          
          altGameIdInput.addEventListener('input', () => {
              const val = altGameIdInput.value.trim();
              if (!val) {
                  altChiefConfirm.style.display = 'none';
                  return;
              }
              altChiefConfirm.style.display = 'block';
              if (idToNameMap[val]) {
                  altChiefConfirm.innerHTML = \`Is your Chief Name: <strong style="color:var(--success)">\${idToNameMap[val]}</strong>?\`;
              } else {
                  altChiefConfirm.innerHTML = \`<span style="color:var(--danger)">Game ID not found in master database.</span>\`;
              }
          });
          
          submitAltBtn.addEventListener('click', async () => {
              const val = altGameIdInput.value.trim();
              if (!val) return;
              try {
                  submitAltBtn.textContent = "Linking...";
                  submitAltBtn.disabled = true;
                  await linkAltAccount(currentUser.uid, val, currentUser.linkedGameIds || []);
                  if(window.showToast) window.showToast("Alt account linked!", "success");
              } catch(e) {
                  if(window.showToast) window.showToast(e.message, "error");
                  else alert(e.message);
                  submitAltBtn.textContent = "Confirm Link";
                  submitAltBtn.disabled = false;
              }
          });
      }
      
      `;

if (content.includes(targetStr) && !content.includes('const openLinkAltBtn')) {
    content = content.replace(targetStr, listeners + targetStr);
    fs.writeFileSync('main.js', content, 'utf8');
    console.log("Success");
} else {
    console.log("Failed or already injected.");
}
