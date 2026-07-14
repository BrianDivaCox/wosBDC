const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

// Replace the onValue Firebase listener for Admin Log with a global window.fetchAdminLog() function
const onValueBlock = `      // Firebase listener for Logs tab
      const adminLogRef = ref(db, 'sheets/Admin Log');
      onValue(adminLogRef, (snapshot) => {
        if (!document.getElementById('adminLogsTableBody')) return;
        const logsData = snapshot.val();
        let tbodyHtml = '';
        let uniqueAdmins = new Set();
        
        if (logsData && logsData.length > 1) {
           for (let i = logsData.length - 1; i >= 1; i--) {
              let row = logsData[i];
              if (row && row[0]) {
                 let d = new Date(row[0]);
                 let dStr = d.toLocaleString([], {month:'numeric', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit'});
                 let adminName = row[1] || '';
                 if (adminName) uniqueAdmins.add(adminName);
                 let playerName = row[2] || '';
                 let amount = row[3] || '';
                 let newTotal = row[4] !== undefined ? row[4] : '';
                 tbodyHtml += \`
                   <tr class="admin-log-row" data-admin="\${adminName.toLowerCase()}" style="border-bottom:1px solid var(--border);">
                     <td style="padding:10px; font-size:13px; color:var(--text-muted);">\${dStr}</td>
                     <td style="padding:10px; font-weight:bold; color:var(--accent);">\${adminName}</td>
                     <td style="padding:10px; font-weight:bold; color:var(--text-main);">\${playerName}</td>
                     <td style="padding:10px; color:var(--text-main);">\${amount}</td>
                     <td style="padding:10px; font-weight:bold; color:var(--success);">\${newTotal}</td>
                   </tr>
                 \`;
              }
           }
        }
        
        if (tbodyHtml === '') tbodyHtml = \`<tr><td colspan="5" style="padding:15px; text-align:center; color:var(--text-muted);">No logs found.</td></tr>\`;
        document.getElementById('adminLogsTableBody').innerHTML = tbodyHtml;
        
        // Populate Admin Filter Dropdown
        const adminSelect = document.getElementById('adminLogFilter');
        if (adminSelect) {
           const currentSelection = adminSelect.value;
           let selectHtml = '<option value="">All Admins</option>';
           Array.from(uniqueAdmins).sort().forEach(admin => {
              selectHtml += \`<option value="\${admin.toLowerCase()}">\${admin}</option>\`;
           });
           adminSelect.innerHTML = selectHtml;
           adminSelect.value = currentSelection;
        }
      });`;

const fetchAdminLogBlock = `      // Global function to manually fetch the freshest Admin Log from Sheets API
      window.fetchAdminLog = async () => {
        const tb = document.getElementById('adminLogsTableBody');
        if (!tb) return;
        tb.innerHTML = \`<tr><td colspan="5" style="padding:15px; text-align:center; color:var(--text-muted);">Fetching directly from Google Sheets...</td></tr>\`;
        try {
          const res = await fetch(API_BASE_URL + '?api=getSheetData&sheetName=Admin Log').then(r => r.json());
          if (res.success && res.data) {
            const logsData = res.data;
            let tbodyHtml = '';
            let uniqueAdmins = new Set();
            if (logsData && logsData.length > 1) {
               for (let i = logsData.length - 1; i >= 1; i--) {
                  let row = logsData[i];
                  if (row && row[0]) {
                     let d = new Date(row[0]);
                     let dStr = d.toLocaleString([], {month:'numeric', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit'});
                     let adminName = row[1] || '';
                     if (adminName) uniqueAdmins.add(adminName);
                     let playerName = row[2] || '';
                     let amount = row[3] || '';
                     let newTotal = row[4] !== undefined ? row[4] : '';
                     tbodyHtml += \`
                       <tr class="admin-log-row" data-admin="\${adminName.toLowerCase()}" style="border-bottom:1px solid var(--border);">
                         <td style="padding:10px; font-size:13px; color:var(--text-muted);">\${dStr}</td>
                         <td style="padding:10px; font-weight:bold; color:var(--accent);">\${adminName}</td>
                         <td style="padding:10px; font-weight:bold; color:var(--text-main);">\${playerName}</td>
                         <td style="padding:10px; color:var(--text-main);">\${amount}</td>
                         <td style="padding:10px; font-weight:bold; color:var(--success);">\${newTotal}</td>
                       </tr>
                     \`;
                  }
               }
            }
            if (tbodyHtml === '') tbodyHtml = \`<tr><td colspan="5" style="padding:15px; text-align:center; color:var(--text-muted);">No logs found.</td></tr>\`;
            tb.innerHTML = tbodyHtml;
            
            const adminSelect = document.getElementById('adminLogFilter');
            if (adminSelect) {
               const currentSelection = adminSelect.value;
               let selectHtml = '<option value="">All Admins</option>';
               Array.from(uniqueAdmins).sort().forEach(admin => {
                  selectHtml += \`<option value="\${admin.toLowerCase()}">\${admin}</option>\`;
               });
               adminSelect.innerHTML = selectHtml;
               adminSelect.value = currentSelection;
            }
          }
        } catch(err) {
          tb.innerHTML = \`<tr><td colspan="5" style="padding:15px; text-align:center; color:var(--danger);">Error fetching logs. Check console.</td></tr>\`;
        }
      };
      
      // Initial fetch
      window.fetchAdminLog();`;

code = code.replace(onValueBlock, fetchAdminLogBlock);

// Add Refresh button to Admin Logs tab
const oldAdminHeader = `<h3 style="margin:0; color:var(--text-main);">📊 Admin Activity Logs</h3>`;
const newAdminHeader = `<h3 style="margin:0; color:var(--text-main);">📊 Admin Activity Logs</h3><button onclick="window.fetchAdminLog()" style="background:var(--accent); color:white; border:none; border-radius:6px; padding:6px 12px; cursor:pointer; font-weight:bold; font-size:12px;">🔄 Refresh</button>`;
code = code.replace(oldAdminHeader, newAdminHeader);

fs.writeFileSync('main.js', code, 'utf8');
console.log("Updated Admin Log rendering");
