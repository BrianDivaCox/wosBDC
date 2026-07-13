const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const regex = /<select id="uniSearchInput"[^>]*>[\s\S]*?\$\{playerOptions\}[\s\S]*?<\/select>\s*<button onclick="window\.searchPlayerFull\(document\.getElementById\('uniSearchInput'\)\.value\)"[^>]*>Search<\/button>/g;

const replacement = `
                <input type="text" id="uniSearchInput" list="uniSearchDatalist" onchange="window.searchPlayerFull(this.value)" placeholder="Search Chief Name..." style="flex:1; padding:10px 12px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main); font-size:16px; font-weight:bold; cursor:text;">
                <datalist id="uniSearchDatalist">
                  \${playerOptions}
                </datalist>
                <button onclick="window.searchPlayerFull(document.getElementById('uniSearchInput').value)" style="background:var(--accent); color:#fff; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:16px;">Search</button>
`;

if (content.match(regex)) {
    content = content.replace(regex, replacement.trim());
    fs.writeFileSync('main.js', content, 'utf8');
    console.log("Success!");
} else {
    console.log("No match found!");
}
