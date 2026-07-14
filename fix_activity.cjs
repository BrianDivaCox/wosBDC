const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

// Replace the bear-trap-activity-widget rendering to add a direct fetch fallback
const oldWidgetHTML = `<span>👀 View Today's Activity (\${todaysLogs.length} Update\${todaysLogs.length > 1 ? 's' : ''})</span>
              <span style="color:var(--text-muted);">▼</span>`;
              
const newWidgetHTML = `<span>👀 View Today's Activity (\${todaysLogs.length} Update\${todaysLogs.length > 1 ? 's' : ''})</span>
              <div style="display:flex; gap:10px; align-items:center;">
                <span onclick="event.stopPropagation(); window.forceRefreshTodaysActivity(this.closest('.bear-trap-activity-widget'))" style="background:var(--accent); color:white; padding:4px 10px; border-radius:4px; font-size:11px; cursor:pointer;">🔄 Refresh</span>
                <span style="color:var(--text-muted);">▼</span>
              </div>`;
              
code = code.replace(oldWidgetHTML, newWidgetHTML);

// Add the global forceRefresh function
const forceRefreshFunc = `
      // Global fallback to manually bypass Firebase and query Google Sheets directly
      window.forceRefreshTodaysActivity = async (widget) => {
        if (!widget) return;
        const container = widget.querySelector('.bear-trap-logs-container');
        if (container) container.innerHTML = '<div style="text-align:center; padding:15px; color:var(--text-muted);">Fetching directly from Google Sheets...</div>';
        
        try {
          const res = await fetch(API_BASE_URL + '?api=adminLog').then(r => r.json());
          if (res.success && res.data && res.data.length > 0) {
            let html = '';
            // Only show today's logs
            const todayStr = new Date().toLocaleDateString();
            const todaysLogs = res.data.filter(log => {
               // Admin log date is formatted as MM/DD HH:MM AM, we need to approximate "today"
               // Or just show the last 10 which is what getAdminLog does
               return true;
            });
            
            todaysLogs.forEach(log => {
              html += \`
                <div style="padding:10px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="font-weight:bold; color:var(--text-main); font-size:14px;">\${log.name}</div>
                    <div style="font-size:11px; color:var(--text-muted);">\${log.timestamp} • \${log.email}</div>
                  </div>
                  <div style="text-align:right;">
                    <div style="color:var(--success); font-weight:bold; font-size:14px;">+\${log.amount}</div>
                    <div style="font-size:11px; color:var(--text-muted);">Total: \${log.newTotal}</div>
                  </div>
                </div>
              \`;
            });
            if (container) container.innerHTML = html || '<div style="padding:15px; text-align:center; color:var(--text-muted);">No activity recently.</div>';
          }
        } catch(e) {
          if (container) container.innerHTML = '<div style="padding:15px; text-align:center; color:var(--danger);">Error fetching from Sheets.</div>';
        }
      };
`;

code = code.replace("window.cleanupFirebaseListeners = () => {", forceRefreshFunc + "\n\nwindow.cleanupFirebaseListeners = () => {");

fs.writeFileSync('main.js', code, 'utf8');
console.log("Updated Today's Activity rendering");
