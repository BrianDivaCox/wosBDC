const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Remove toggle HTML
const htmlRegex = /\s*\$\{!globalRosterRegisteredOnly \? `[\s\S]*?<\/label>\s*<\/div>` : ''\}/;
content = content.replace(htmlRegex, "");

// 2. Remove regToggle element fetch
const elementTarget = `          const container = document.getElementById('playerProfileContainer');
          const regToggle = document.getElementById('registeredOnlyToggle');
          
          const renderDropdownOptions = () => {
              const onlyReg = globalRosterRegisteredOnly || (regToggle && regToggle.checked);`;

const elementNew = `          const container = document.getElementById('playerProfileContainer');
          
          const renderDropdownOptions = () => {
              const onlyReg = globalRosterRegisteredOnly;`;

content = content.replace(elementTarget, elementNew);

// 3. Remove regToggle listener
const listenerRegex = /\s*if \(regToggle\) \{\s*regToggle\.addEventListener\('change', \(\) => \{\s*renderDropdownOptions\(\);\s*select\.value = "";\s*renderCardForChief\(""\); \/\/ Clear profile\s*\}\);\s*\}/;
content = content.replace(listenerRegex, "");

fs.writeFileSync('main.js', content, 'utf8');
console.log("Removed front-end toggle.");
