const fs = require('fs');
let lines = fs.readFileSync('main.js', 'utf8').split('\n');

// 504
if(lines[503].includes('let usersSnap')) {
  lines[503] = '        try { await get(ref(db, \'users\')); } catch(e) { console.warn("Could not fetch users:", e); }';
}
// 515
if(lines[514].includes('const lbMap')) {
  lines[514] = '';
}
// 547
if(lines[546].includes('all-time showdown')) {
  lines[546] = '                if (t.includes(\'all-time showdown\')) { /* noop */ }';
}
// 867
if(lines[866].includes('const navLinks')) {
  lines[866] = '';
}
// 943
if(lines[942].includes('throw new Error("Database API')) {
  lines[942] = '             throw new Error("Database API is currently unavailable.", { cause: e });';
}
if(lines[944].includes('throw new Error("Invalid JSON')) {
  lines[944] = '          throw new Error("Invalid JSON response.", { cause: e });';
}
// 982
if(lines[981].includes('devModeToggle')) lines[981] = '';
if(lines[983].includes('devModeSlider')) lines[983] = '';

// 1262
if(lines[1261].includes('for (const [uid, u]')) {
  lines[1261] = '      for (const [, u] of Object.entries(users)) {';
}

// 1652, 1676, 1716
if(lines[1651].includes('catch(e) {')) lines[1651] = '      } catch {';
if(lines[1675].includes('catch(e) {')) lines[1675] = '      } catch {';
if(lines[1715].includes('catch(e) {')) lines[1715] = '         } catch {';

// 3602
if(lines[3601].includes('catch (e) {}')) {
  lines[3601] = '  try { missedEvents = JSON.parse(missedEventsStr); } catch { /* ignore */ }';
}

fs.writeFileSync('main.js', lines.join('\n'), 'utf8');
console.log("Safe ESLint fixes applied.");
