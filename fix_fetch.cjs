const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const oldFetchBlock = `    window.livePromises[sheetName] = new Promise((resolve, reject) => {
      const sheetRef = ref(db, \`sheets/\${sheetName}\`);
      window.liveListeners[sheetName] = onValue(sheetRef, (snapshot) => {
        const data = snapshot.val();
        const isUpdate = window.liveData[sheetName] !== undefined;
        
        window.liveData[sheetName] = data;
        
        if (!isUpdate) {
          resolve(data);
        } else {
          if (window.activeViewFunc) {
            console.log(\`Live sync: \${sheetName} updated. Re-rendering view...\`);
            window.activeViewFunc();
          }
        }
      }, async (error) => {`;

const newFetchBlock = `    window.livePromises[sheetName] = new Promise((resolve, reject) => {
      const sheetRef = ref(db, \`sheets/\${sheetName}\`);
      window.liveListeners[sheetName] = onValue(sheetRef, async (snapshot) => {
        const data = snapshot.val();
        
        if (!data) {
           console.warn(\`Data for \${sheetName} not found in Firebase, falling back to GAS...\`);
           try {
             const res = await fetch(\`\${API_BASE_URL}?api=\${encodeURIComponent(sheetName)}\`);
             const text = await res.text();
             let json;
             try { json = JSON.parse(text); } catch (e) {}
             
             let fallbackData = (json && json.success && json.data) ? json.data : (json || null);
             window.liveData[sheetName] = fallbackData;
             resolve(fallbackData);
           } catch(e) {
             resolve(null);
           }
           return;
        }
        
        const isUpdate = window.liveData[sheetName] !== undefined;
        window.liveData[sheetName] = data;
        
        if (!isUpdate) {
          resolve(data);
        } else {
          if (window.activeViewFunc) {
            console.log(\`Live sync: \${sheetName} updated. Re-rendering view...\`);
            window.activeViewFunc();
          }
        }
      }, async (error) => {`;

content = content.replace(oldFetchBlock, newFetchBlock);
fs.writeFileSync('main.js', content, 'utf8');
console.log("Updated fetchSheet fallback logic");
