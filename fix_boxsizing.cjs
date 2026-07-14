const fs = require('fs');

let main = fs.readFileSync('main.js', 'utf8');
main = main.replace('width:100%; max-width:400px;', 'box-sizing:border-box; width:100%; max-width:400px;');
fs.writeFileSync('main.js', main, 'utf8');

let css = fs.readFileSync('style.css', 'utf8');
css = css.replace('.id-card-container {\n    padding: 20px;\n}', '.id-card-container {\n    padding: 20px;\n    box-sizing: border-box;\n}');
fs.writeFileSync('style.css', css, 'utf8');

console.log("Fixed box-sizing!");
