const fs = require('fs');

let mainjs = fs.readFileSync('main.js', 'utf8');

// 1. Add generatePlayerProfileHtml
const generatorFunc = `
window.generatePlayerProfileHtml = (chiefName, p, headers, colIsUpcoming, rosterInfo, lbData, dynamicSD, showdownActive, bearBoth, bear1, bear2, btDonationsAllTime, btDonationsCurrent, otherLbs, isAdmin = false) => {
  let headerBadgesHtml = '';
  if (rosterInfo) {
    let gcVal = rosterInfo.giftCodes;
    if (gcVal === true || gcVal === 'TRUE' || (typeof gcVal === 'string' && gcVal.toLowerCase().trim() === 'true')) {
       headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--success) 15%, transparent); border:1px solid var(--success); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">✅ All Gift Codes</span>';
    }
    let taVal = rosterInfo.timeActive;
    if (taVal && taVal.toString().trim() !== "") {
       headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--text-main) 10%, transparent); border:1px solid var(--border); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">⏱️ '+taVal+'</span>';
    }
  }
  
  let activityBadges = '';
  let missedDays = p[1];
  if (showdownActive) {
    if (missedDays === undefined || missedDays === null || missedDays.toString().trim() === "" || missedDays === 0 || missedDays === "0") {
       activityBadges += '<span style="background:color-mix(in srgb, #f97316 15%, transparent); border:1px solid #f97316; color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🔥 Perfect Attendance</span>';
    }
  }
  
  const isTrue = (val) => val === true || (typeof val === 'string' && val.toLowerCase().trim() === 'true');
  
  if (isTrue(p[2])) {
     activityBadges += '<span style="background:color-mix(in srgb, #fbbf24 15%, transparent); border:1px solid #fbbf24; color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🏆 Championship</span>';
  }
  if (isTrue(p[3])) {
     activityBadges += '<span style="background:color-mix(in srgb, #ef4444 15%, transparent); border:1px solid #ef4444; color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">⚔️ Mercenary</span>';
  }
  if (isTrue(p[4])) {
     activityBadges += '<span style="background:color-mix(in srgb, #38bdf8 15%, transparent); border:1px solid #38bdf8; color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🐻‍❄️ Polar Terrors</span>';
  }
  
  if (activityBadges) {
     headerBadgesHtml += '<div style="display:flex; gap:10px; margin-top:8px; flex-wrap:wrap;">' + activityBadges + '</div>';
  }
  
  if ((lbData && lbData.length > 0) || dynamicSD) {
    headerBadgesHtml += '<div style="display:flex; gap:10px; margin-top:8px; flex-wrap:wrap;">';
    
    if (dynamicSD) {
       let scoreStr = Number(dynamicSD.score).toLocaleString();
       headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🏅 All-Time Showdown: <span style="color:var(--text-main);">#'+dynamicSD.rank+' ('+scoreStr+')</span></span>';
    }
    
    if (bear1 || bear2 || bearBoth) {
       let innerText = "";
       if (bearBoth && bear1 && bear2) innerText = bearBoth + ' Total (T1: ' + bear1 + ' | T2: ' + bear2 + ')';
       else if (bear1 && bear2) innerText = 'T1: ' + bear1 + ' | T2: ' + bear2;
       else if (bearBoth) innerText = bearBoth + ' Total';
       else if (bear1) innerText = 'T1: ' + bear1;
       else if (bear2) innerText = 'T2: ' + bear2;
       
       headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🐻 Bear Trap Wins: <span style="color:var(--text-main);">'+innerText+'</span></span>';
    }
    if (btDonationsCurrent || btDonationsAllTime) {
       let allTimeStr = btDonationsAllTime ? '#' + btDonationsAllTime.rank + ' (' + btDonationsAllTime.score + ') All-Time' : '0 All-Time';
       let currentScoreStr = 0;
       if (btDonationsCurrent) {
           currentScoreStr = '#' + btDonationsCurrent.rank + ' (' + btDonationsCurrent.score + ')';
       }
       let currentStr = currentScoreStr + ' Current';
       let innerText = allTimeStr + ' | ' + currentStr;
       headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">🥩 BT Donations: <span style="color:var(--text-main);">'+innerText+'</span></span>';
       
       if (isAdmin) {
          headerBadgesHtml += '<button onclick="window.promptBearTrap(\\'' + chiefName + '\\')" style="margin-left:10px; background:var(--success); color:#fff; border:none; padding:4px 10px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:11px;">+ Add Donation</button>';
       }
    }
    
    otherLbs.forEach(lb => {
      headerBadgesHtml += '<span style="background:color-mix(in srgb, var(--accent) 15%, transparent); border:1px solid var(--accent); color:var(--text-main); padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold;">' + lb.emoji + ' ' + lb.title + ': <span style="color:var(--text-main);">' + lb.score + '</span></span>';
    });
    
    headerBadgesHtml += '</div>';
  }
  
  let metricsHtml = '<div style="margin-top: 25px;">';
  metricsHtml += '<h3 style="margin: 0 0 5px 0; color:var(--text-main); font-size:16px; border-bottom:1px solid var(--border); padding-bottom:8px;">📅 Events Checklist</h3>';
  metricsHtml += '<p style="font-size:11px; color:var(--text-muted); margin:0 0 15px 0;">✅ = Participated / Done <span style="margin:0 5px;">|</span> ❌ = Action Required <span style="margin:0 5px;">|</span> ⏳ = Upcoming' + (isAdmin ? ' <span style="color:var(--danger); font-weight:bold; margin-left:10px;">(Click ❌ to edit)</span>' : '') + '</p>';
  metricsHtml += '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:15px;">';
  
  const supportedEvents = ["Alliance Championship", "Polar Terrors", "Mercenary Prestige", "Voter"];
  
  for (let col = 1; col < headers.length; col++) {
    let header = headers[col] || "Metric " + col;
    if (header.toLowerCase().includes("bt donation")) continue;
    
    let val = p[col];
    let isX = false;
    
    if (val === undefined || val === null || val.toString().trim() === "") {
      val = "<span style='color:var(--text-muted);'>-</span>";
      isX = true; // empty treats as action required
    } else {
      let strVal = val.toString().toLowerCase().trim();
      if (val === true || strVal === "true" || strVal === "✅" || strVal === "yes") {
        val = "✅";
      } else if (val === false || strVal === "false" || strVal === "❌" || strVal === "no") {
        val = colIsUpcoming[col] ? "⏳" : "❌";
        if (val === "❌") isX = true;
      }
    }
    
    let boxStyle = "background:var(--bg-main); border:1px solid var(--border); border-radius:8px; padding:15px; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.05); transition:transform 0.2s;";
    let boxContent = '<div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; font-weight:bold;">'+header+'</div>';
    boxContent += '<div style="font-size:18px; font-weight:bold; color:var(--text-main);">'+val+'</div>';
    
    let isSupported = supportedEvents.some(s => header.toLowerCase().includes(s.toLowerCase()));
    
    if (isAdmin && isX && isSupported) {
       metricsHtml += '<div onclick="window.promptEventUpdate(\\''+chiefName+'\\', \\''+header+'\\')" style="cursor:pointer; border-color:var(--danger); '+boxStyle+'" onmouseover="this.style.transform=\\'scale(1.05)\\'; this.style.background=\\'color-mix(in srgb, var(--danger) 10%, var(--bg-main))\\';" onmouseout="this.style.transform=\\'none\\'; this.style.background=\\'var(--bg-main)\\';">' + boxContent + '</div>';
    } else if (isAdmin && isX) {
       metricsHtml += '<div title="This event is not supported for editing yet." style="'+boxStyle+'">' + boxContent + '</div>';
    } else {
       metricsHtml += '<div style="'+boxStyle+'">' + boxContent + '</div>';
    }
  }
  metricsHtml += '</div></div>';
  
  let playerGameId = nameToIdMap[chiefName];
  let tryUrl = (playerGameId && avatarMap[playerGameId]) ? avatarMap[playerGameId] : 'images/' + chiefName + '.png';
  
  let avatarImgHtml = '<img src="'+tryUrl+'" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.style.display=\\'none\\'; this.nextElementSibling.style.display=\\'flex\\';"><div style="display:none; align-items:center; justify-content:center; width:100%; height:100%;">' + chiefName.charAt(0).toUpperCase() + '</div>';
  
  let html = '<div class="card" style="margin-bottom:20px; animation: fadeIn 0.3s ease;"><div style="display:flex; align-items:center; gap:20px; margin-bottom:15px;"><div style="width:70px; height:70px; border-radius:50%; overflow:hidden; background:var(--accent); color:#fff; font-size:32px; font-weight:bold; display:flex; justify-content:center; align-items:center; border:2px solid var(--border); box-shadow:0 4px 10px rgba(0,0,0,0.1);">' + avatarImgHtml + '</div><div style="flex:1;"><h2 style="margin:0; font-size:24px; color:var(--text-main); display:flex; align-items:center; gap:10px;">' + chiefName + '</h2>' + headerBadgesHtml + '</div></div>' + metricsHtml + '</div>';
  return html;
};

window.promptEventUpdate = async (name, eventHeader) => {
  if (!confirm("Mark " + eventHeader + " as Participated (✅) for " + name + "?")) return;
  
  let eventSheetName = eventHeader;
  if (eventHeader.toLowerCase().includes('championship')) eventSheetName = "Alliance Championship ";
  
  window.showToast("Updating "+eventHeader+"...", "success");
  
  const adminName = currentUser ? (idToNameMap[currentUser.gameId] || "Admin") : "Admin";
  try {
    const res = await fetch(\`\${API_BASE_URL}?api=updateEvent&name=\${encodeURIComponent(name)}&eventName=\${encodeURIComponent(eventSheetName)}&status=Yes&admin=\${encodeURIComponent(adminName)}\`).then(r => r.json());
    if (res.success) {
      window.showToast("Successfully updated!", "success");
      window.sheetCache = {}; 
      if (document.getElementById('uniSearchInput')) {
        window.searchPlayerFull(name); 
      } else {
        views.roster();
      }
    } else {
      alert("Error: " + res.message);
    }
  } catch (err) {
    alert("Network Error: " + err.message);
  }
};

window.promptBearTrap = async (name) => {
  let amt = prompt("Enter Bear Trap Donation Amount to ADD for " + name + ":");
  if (!amt) return;
  if (isNaN(amt)) { alert("Invalid number"); return; }
  
  window.showToast("Adding donation...", "success");
  const adminName = currentUser ? (idToNameMap[currentUser.gameId] || "Admin") : "Admin";
  try {
    const res = await fetch(\`\${API_BASE_URL}?api=addDonation&name=\${encodeURIComponent(name)}&amount=\${encodeURIComponent(amt)}&admin=\${encodeURIComponent(adminName)}\`).then(r => r.json());
    if (res.success) {
      window.showToast("Successfully added! New Total: " + res.newTotal, "success");
      window.sheetCache = {}; 
      if (document.getElementById('uniSearchInput')) {
        window.searchPlayerFull(name);
      } else {
        views.roster();
      }
    } else {
      alert("Error: " + res.message);
    }
  } catch (err) {
    alert("Network Error: " + err.message);
  }
};
`;

mainjs += "\n" + generatorFunc;

fs.writeFileSync('main.js', mainjs);
console.log('Done appending globals.');
