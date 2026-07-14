const fs = require('fs');

let main = fs.readFileSync('main.js', 'utf8');

// Replace margins and gaps in main.js
main = main.replace('<div class="id-card-header" style="display:flex; align-items:center; margin-bottom:25px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:20px; position:relative; z-index:2;">', '<div class="id-card-header" style="display:flex; align-items:center; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:15px; position:relative; z-index:2;">');

main = main.replace('<div style="display:flex; flex-direction:column; gap:15px; margin-bottom:25px; position:relative; z-index:2;">', '<div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px; position:relative; z-index:2;">');

main = main.replace('<div style="text-align:center; margin-top:25px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.05); position:relative; z-index:2;">', '<div class="id-card-bot-status" style="text-align:center; margin-top:15px; padding-top:15px; border-top:1px solid rgba(255,255,255,0.05); position:relative; z-index:2;">');

main = main.replaceAll('padding:10px 15px;', 'padding:8px 12px;');

fs.writeFileSync('main.js', main, 'utf8');

// Update style.css
let css = fs.readFileSync('style.css', 'utf8');

const oldCss = `/* --- Account Hub Mobile Adjustments --- */
.id-card-container {
    padding: 25px;
}
.id-card-header {
    gap: 20px;
}
.id-card-avatar {
    width: 80px;
    height: 80px;
}
.id-card-name {
    font-size: 24px;
}
.id-card-stat-row {
    flex-wrap: nowrap;
}
.account-hub-buttons {
    flex-direction: row;
}

@media (max-width: 450px) {
    .id-card-container {
        padding: 15px !important;
    }
    .id-card-header {
        gap: 12px !important;
    }
    .id-card-avatar {
        width: 60px !important;
        height: 60px !important;
    }
    .id-card-name {
        font-size: 18px !important;
    }
    .id-card-stat-row {
        flex-wrap: wrap !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 4px !important;
    }
    .id-card-stat-row > span:last-child {
        text-align: left !important;
    }
    .account-hub-buttons {
        flex-direction: column !important;
    }
}`;

const newCss = `/* --- Account Hub Mobile Adjustments --- */
.id-card-container {
    padding: 20px;
}
.id-card-header {
    gap: 15px;
}
.id-card-avatar {
    width: 60px;
    height: 60px;
}
.id-card-name {
    font-size: 20px;
}
.id-card-stat-row {
    flex-wrap: nowrap;
}
.account-hub-buttons {
    flex-direction: row;
}

@media (max-width: 450px) {
    .id-card-container {
        padding: 15px !important;
    }
    .id-card-header {
        gap: 12px !important;
    }
    .id-card-avatar {
        width: 50px !important;
        height: 50px !important;
    }
    .id-card-name {
        font-size: 18px !important;
    }
    .id-card-stat-row {
        flex-wrap: wrap !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 2px !important;
    }
    .id-card-stat-row > span:last-child {
        text-align: left !important;
    }
    .account-hub-buttons {
        flex-direction: column !important;
    }
}`;

css = css.replace(oldCss, newCss);
fs.writeFileSync('style.css', css, 'utf8');

console.log("Updated sizes!");
