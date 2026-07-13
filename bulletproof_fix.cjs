const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// 1. Fix rosterRawData loop bug
const oldLoop = `                if (name && id) {
                    idToNameMap[id] = name.toString().trim();
                      nameToIdMap[name.toString().trim()] = id.toString().trim();
                      enrolledGameIds.add(id.toString().trim());
                  }`;

const newLoop = `                if (name && id) {
                    idToNameMap[id] = name.toString().trim();
                      nameToIdMap[name.toString().trim()] = id.toString().trim();
                  }`;

content = content.split(oldLoop).join(newLoop);


// 2. Fix Alt Account Button logic
const oldAlt = `<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
          <button onclick="window.openAltPerksModal('\\${gid}', '\\${altName.replace(/'/g, "\\\\'")}')" style="background:var(--success); border:none; color:var(--text-main); cursor:pointer; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:4px;">&#x1F381; Enable Perks</button>
          <button onclick="window.unlinkAltAccountPrompt('\\${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:11px;">Unlink</button>
      </div>`;

const newAlt = `\\${ (enrolledGameIds.has(gid.toString())) ? 
      \`<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
          <div style="color:var(--success); font-weight:bold; font-size:11px; padding:4px 8px; border:1px solid var(--success); border-radius:4px; background:rgba(16,185,129,0.1);">&#x2705; Enrolled</div>
          <button onclick="window.unlinkAltAccountPrompt('\\${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:11px;">Unlink</button>
      </div>\` : 
      \`<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
          <button onclick="window.openAltPerksModal('\\${gid}', '\\${altName.replace(/'/g, "\\\\\\'")}')" style="background:var(--success); border:none; color:var(--text-main); cursor:pointer; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:4px;">&#x1F381; Enable Perks</button>
          <button onclick="window.unlinkAltAccountPrompt('\\${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:11px;">Unlink</button>
      </div>\` }`;

content = content.split(oldAlt.replace(/\\/g, '')).join(newAlt.replace(/\\\\/g, '\\')); // Just avoiding template literal parsing entirely using replace regex on backslashes...

// Wait, escaping template literals in JS is a mess when passing it to a script via Powershell.
// Let's just use string methods to read the file and replace it programmatically.
