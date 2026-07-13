fetch('https://wos-website-246e7-default-rtdb.firebaseio.com/sheets/Chief%27s%20List.json')
    .then(res => res.json())
    .then(json => {
        let found = false;
        for(let i=0; i<json.length; i++) {
            if(json[i].some(v => String(v).includes('738952586'))) {
                console.log("Row found in Firebase: " + JSON.stringify(json[i]));
                found = true;
            }
        }
        if(!found) console.log("Game ID 738952586 not found in Firebase Chief's List!");
    })
    .catch(e => console.log("Error: " + e.message));
