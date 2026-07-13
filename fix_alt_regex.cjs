const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const regex = /<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">\s*<button onclick="window\.openAltPerksModal[\s\S]*?Unlink<\/button>\s*<\/div>/g;

const replacement = `\${ (enrolledGameIds.has(gid.toString())) ? 
      \`<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
          <div style="color:var(--success); font-weight:bold; font-size:11px; padding:4px 8px; border:1px solid var(--success); border-radius:4px; background:rgba(16,185,129,0.1);">&#x2705; Enrolled</div>
          <button onclick="window.unlinkAltAccountPrompt('\${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:11px;">Unlink</button>
      </div>\` : 
      \`<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
          <button onclick="window.openAltPerksModal('\${gid}', '\${altName.replace(/'/g, "\\\\'")}')" style="background:var(--success); border:none; color:var(--text-main); cursor:pointer; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:4px;">&#x1F381; Enable Perks</button>
          <button onclick="window.unlinkAltAccountPrompt('\${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:11px;">Unlink</button>
      </div>\` }`;

content = content.replace(regex, replacement);

fs.writeFileSync('main.js', content, 'utf8');
console.log("Success");
