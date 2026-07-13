const fs = require('fs');
const report = JSON.parse(fs.readFileSync('eslint_report.json', 'utf8'));

let errors = 0;
let warnings = 0;
const ruleCounts = {};

report.forEach(file => {
    errors += file.errorCount;
    warnings += file.warningCount;
    file.messages.forEach(msg => {
        ruleCounts[msg.ruleId] = (ruleCounts[msg.ruleId] || 0) + 1;
    });
});

console.log(`Total Errors: ${errors}`);
console.log(`Total Warnings: ${warnings}`);
console.log("Rule Breakdown:");
Object.entries(ruleCounts).sort((a,b) => b[1] - a[1]).forEach(([rule, count]) => {
    console.log(`  - ${rule}: ${count}`);
});
