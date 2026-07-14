const fs = require('fs');

let main = fs.readFileSync('main.js', 'utf8');

main = main.replaceAll("cell.toLowerCase().includes('all-time bear donations')", "(cell.toLowerCase().includes('all-time') && (cell.toLowerCase().includes('bear') || cell.toLowerCase().includes('bt')) && cell.toLowerCase().includes('donation'))");

main = main.replaceAll("t.includes('all-time bear donations')", "(t.includes('all-time') && (t.includes('bear') || t.includes('bt')) && t.includes('donation'))");

main = main.replaceAll("t.includes('bear donations')", "((t.includes('bear') || t.includes('bt')) && t.includes('donation'))");

main = main.replaceAll("board.title.toLowerCase().includes('bear donations')", "((board.title.toLowerCase().includes('bear') || board.title.toLowerCase().includes('bt')) && board.title.toLowerCase().includes('donation'))");

fs.writeFileSync('main.js', main, 'utf8');

console.log("Fixed BT parsing");
