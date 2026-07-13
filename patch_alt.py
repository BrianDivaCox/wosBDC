import sys

def main():
    try:
        with open("main.js", "r", encoding="utf-8") as f:
            content = f.read()

        old2 = """<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
          <button onclick="window.openAltPerksModal('${gid}', '${altName.replace(/'/g, "\'")}')" style="background:var(--success); border:none; color:var(--text-main); cursor:pointer; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:4px;">&#x1F381; Enable Perks</button>
          <button onclick="window.unlinkAltAccountPrompt('${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:11px;">Unlink</button>
      </div>"""
      
        new2 = """${ (enrolledGameIds.has(gid.toString())) ? 
      `<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
          <div style="color:var(--success); font-weight:bold; font-size:11px; padding:4px 8px; border:1px solid var(--success); border-radius:4px; background:rgba(16,185,129,0.1);">&#x2705; Enrolled</div>
          <button onclick="window.unlinkAltAccountPrompt('${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:11px;">Unlink</button>
      </div>` : 
      `<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
          <button onclick="window.openAltPerksModal('${gid}', '${altName.replace(/'/g, "\\'")}')" style="background:var(--success); border:none; color:var(--text-main); cursor:pointer; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:4px;">&#x1F381; Enable Perks</button>
          <button onclick="window.unlinkAltAccountPrompt('${gid}')" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:11px;">Unlink</button>
      </div>` }"""

        content = content.replace(old2, new2)
        
        with open("main.js", "w", encoding="utf-8") as f:
            f.write(content)
            
        print("Python alt replacement success!")
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    main()
