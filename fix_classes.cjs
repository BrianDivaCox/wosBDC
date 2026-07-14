const fs = require('fs');
let main = fs.readFileSync('main.js', 'utf8');

// Replace standard tags with classed tags
main = main.replace('<div style="position:relative; width:100%; max-width:400px; margin:0 auto 30px auto; background:linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95)); border:1px solid rgba(56,189,248,0.3); border-radius:16px; box-shadow:0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(56,189,248,0.1); overflow:hidden; padding:25px; backdrop-filter:blur(10px); text-align:left;">', '<div class="id-card-container" style="position:relative; width:100%; max-width:400px; margin:0 auto 30px auto; background:linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95)); border:1px solid rgba(56,189,248,0.3); border-radius:16px; box-shadow:0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(56,189,248,0.1); overflow:hidden; backdrop-filter:blur(10px); text-align:left;">');

main = main.replace('<div style="display:flex; align-items:center; gap:20px; margin-bottom:25px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:20px; position:relative; z-index:2;">', '<div class="id-card-header" style="display:flex; align-items:center; margin-bottom:25px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:20px; position:relative; z-index:2;">');

main = main.replace('<div style="width:80px; height:80px; border-radius:12px; overflow:hidden; border:2px solid var(--accent); box-shadow:0 4px 15px rgba(0,0,0,0.3); background:var(--bg-secondary); flex-shrink:0;">', '<div class="id-card-avatar" style="border-radius:12px; overflow:hidden; border:2px solid var(--accent); box-shadow:0 4px 15px rgba(0,0,0,0.3); background:var(--bg-secondary); flex-shrink:0;">');

main = main.replace('<h2 style="margin:0 0 5px 0; color:#fff; font-size:24px; letter-spacing:0.5px; text-shadow:0 2px 4px rgba(0,0,0,0.5); white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">', '<h2 class="id-card-name" style="margin:0 0 5px 0; color:#fff; letter-spacing:0.5px; text-shadow:0 2px 4px rgba(0,0,0,0.5); white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">');

main = main.replaceAll('<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:10px 15px; border-radius:8px;">', '<div class="id-card-stat-row" style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:10px 15px; border-radius:8px;">');

main = main.replace('<div style="display:flex; gap:10px; margin-bottom:20px; max-width:400px; margin-left:auto; margin-right:auto;">\n            <button onclick="window.addAltAccountPrompt()"', '<div class="account-hub-buttons" style="display:flex; gap:10px; margin-bottom:20px; max-width:400px; margin-left:auto; margin-right:auto;">\n            <button onclick="window.addAltAccountPrompt()"');

fs.writeFileSync('main.js', main, 'utf8');
console.log("Updated classes!");
