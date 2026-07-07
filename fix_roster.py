import re

with open('main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of the listener
start_str = "      select.addEventListener('change', (e) => {"
end_str = "      });\n      \n    } catch(e) { renderError(e.message); }"

start_idx = content.find(start_str)
end_idx = content.find(end_str, start_idx)

if start_idx != -1 and end_idx != -1:
    new_listener = """      select.addEventListener('change', (e) => {
        const idx = e.target.value;
        if (idx === "") {
          container.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:40px; font-size:16px;">Select a player to view their activity profile.</div>`;
          return;
        }
        
        const p = players[idx];
        const chiefName = p[0].toString().trim();
        
        let dynamicSD = null;
        if (allTimeRankingsMap[chiefName]) {
          dynamicSD = allTimeRankingsMap[chiefName];
        }
        
        let lbData = lbMap[chiefName];
        let bearBoth = null, bear1 = null, bear2 = null, btDonationsAllTime = null, btDonationsCurrent = null;
        let otherLbs = [];
        if (lbData) {
            lbData.forEach(lb => {
                if (lb.title.toLowerCase().includes('all-time showdown')) return;
                let t = lb.title.toLowerCase();
                if (t.includes('bear trap 1')) bear1 = lb.score;
                else if (t.includes('bear trap 2')) bear2 = lb.score;
                else if (t.includes('both bear trap')) bearBoth = lb.score;
                else if (t.includes('all-time bear donations')) btDonationsAllTime = lb;
                else if (t.includes('bear donations')) btDonationsCurrent = lb;
                else otherLbs.push(lb);
            });
        }
        
        let html = window.generatePlayerProfileHtml(chiefName, p, headers, colIsUpcoming, rosterMap[chiefName], lbData, dynamicSD, showdownActive, bearBoth, bear1, bear2, btDonationsAllTime, btDonationsCurrent, otherLbs, false);
        container.innerHTML = html;
"""
    new_content = content[:start_idx] + new_listener + content[end_idx:]
    with open('main.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Fixed listener in main.js")
else:
    print("Could not find bounds. start:", start_idx, "end:", end_idx)
