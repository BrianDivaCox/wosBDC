import sys

def main():
    try:
        with open("main.js", "r", encoding="utf-8") as f:
            content = f.read()

        # 1. Roster fix
        old1 = """                if (name && id) {
                    idToNameMap[id] = name.toString().trim();
                      nameToIdMap[name.toString().trim()] = id.toString().trim();
                      enrolledGameIds.add(id.toString().trim());
                  }"""
        new1 = """                if (name && id) {
                    idToNameMap[id] = name.toString().trim();
                      nameToIdMap[name.toString().trim()] = id.toString().trim();
                  }"""
        content = content.replace(old1, new1)

        # 2. Alt account fix
        old2 = """<div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end;">
          <button onclick="window.openAltPerksModal('${gid}', '${altName.replace(/'/g, "\\'")}')" style="background:var(--success); border:none; color:var(--text-main); cursor:pointer; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:4px;">&#x1F381; Enable Perks</button>
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
        
        # 3. Main account fix
        old3 = """contentHtml = `
          <div style="text-align:center; padding:40px 20px;">
            <div style="font-size:48px; margin-bottom:20px;">&#x1F381;</div>
            <h3 style="color:var(--text-main); margin-bottom:10px;">Enable Auto Redeem</h3>
            <p style="color:var(--text-muted); margin-bottom:25px; font-size:15px; line-height:1.5;">Welcome <strong>${chiefName}</strong>! Click below to securely link your Game ID (${currentUser.gameId}) to the Auto Redeem Bot. We will automatically fetch all new gift codes and inject them into your account!</p>
            <button id="optInPerksBtn" style="background:var(--success); color:var(--text-main); border:none; padding:14px 28px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px; transition:0.2s; box-shadow:0 4px 15px rgba(16,185,129,0.3);">1-Click Opt-In</button>
            <p style="margin-top:20px; font-size:13px; color:var(--text-muted);"><em>No double data entry needed. It's fully automated!</em></p>
          </div>
        `;"""
        
        new3 = """if (enrolledGameIds.has(currentUser.gameId.toString())) {
            contentHtml = `
              <div style="text-align:center; padding:40px 20px;">
                <div style="font-size:48px; margin-bottom:20px;">&#x2705;</div>
                <h3 style="color:var(--success); margin-bottom:10px;">Already Enrolled!</h3>
                <p style="color:var(--text-muted); margin-bottom:25px; font-size:15px; line-height:1.5;">Your Game ID (<strong>${currentUser.gameId}</strong>) is already actively monitored by the Auto Redeem Bot.</p>
                <button disabled style="background:transparent; color:var(--success); border:1px solid var(--success); padding:14px 28px; border-radius:8px; font-weight:bold; font-size:16px;">Active &#x2705;</button>
              </div>
            `;
        } else {
            contentHtml = `
              <div style="text-align:center; padding:40px 20px;">
                <div style="font-size:48px; margin-bottom:20px;">&#x1F381;</div>
                <h3 style="color:var(--text-main); margin-bottom:10px;">Enable Auto Redeem</h3>
                <p style="color:var(--text-muted); margin-bottom:25px; font-size:15px; line-height:1.5;">Welcome <strong>${chiefName}</strong>! Click below to securely link your Game ID (${currentUser.gameId}) to the Auto Redeem Bot. We will automatically fetch all new gift codes and inject them into your account!</p>
                <button id="optInPerksBtn" style="background:var(--success); color:var(--text-main); border:none; padding:14px 28px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px; transition:0.2s; box-shadow:0 4px 15px rgba(16,185,129,0.3);">1-Click Opt-In</button>
                <p style="margin-top:20px; font-size:13px; color:var(--text-muted);"><em>No double data entry needed. It's fully automated!</em></p>
              </div>
            `;
        }"""
        
        content = content.replace(old3, new3)

        with open("main.js", "w", encoding="utf-8") as f:
            f.write(content)
            
        print("Python replacement success!")
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    main()
