const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const newInputs = `      <input type="text" id="authChiefName" placeholder="Chief Name" style="width:100%; padding:10px; margin-bottom:15px; border-radius:6px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); box-sizing:border-box; display:none;">
      <input type="date" id="authDateStarted" title="Date Started" style="width:100%; padding:10px; margin-bottom:15px; border-radius:6px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main); box-sizing:border-box; display:none;">`;

content = content.replace(
  '<input type="number" id="authGameId" placeholder="Game ID', 
  newInputs + '\n      <input type="number" id="authGameId" placeholder="Game ID'
);

fs.writeFileSync('index.html', content, 'utf8');
console.log("Updated index.html");
