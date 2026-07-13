fetch('https://script.google.com/macros/s/AKfycbxXjDN5nXVsdojTudMtChy4ts6l4fckyKZGRTa7f689IiI8giejnzys4bnlIZaL28g/exec?api=Chief%27s%20List')
    .then(res => res.json())
    .then(json => {
        let data = json.data;
        let found = false;
        for(let i=0; i<data.length; i++) {
            if(data[i].some(v => String(v).includes('738952586'))) {
                console.log("Row found: " + JSON.stringify(data[i]));
                found = true;
            }
        }
        if(!found) console.log("Game ID 738952586 not found in Chief's List!");
    })
    .catch(e => console.log("Error: " + e.message));
