fetch('https://script.google.com/macros/s/AKfycbx_Q4-61TfP5j4_fT5w3a4UARj98vW6U8788n4mR0U9G5b25xQ32nF7yXzX5pI4kG3E/exec?api=Chief%27s%20List')
    .then(res => res.json())
    .then(json => {
        let found = false;
        for(let i=0; i<json.length; i++) {
            if(json[i].some(v => String(v).includes('738952586'))) {
                console.log("Row found: " + JSON.stringify(json[i]));
                found = true;
            }
        }
        if(!found) console.log("Game ID 738952586 not found in Chief's List!");
    })
    .catch(e => console.log("Error: " + e.message));
