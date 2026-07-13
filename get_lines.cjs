const fs = require('fs');
const lines = fs.readFileSync('main.js', 'utf8').split('\n');
const targets = [215, 302, 504, 515, 547, 867, 941, 943, 945, 982, 984, 1028, 1262, 1652, 1676, 1716, 3481, 3602];
targets.forEach(n => {
    const start = Math.max(0, n - 2);
    const end = Math.min(lines.length - 1, n + 2);
    console.log(`\n--- Line ${n} ---`);
    for (let i = start; i <= end; i++) {
        console.log(`${i+1}: ${lines[i]}`);
    }
});
