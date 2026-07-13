fetch('https://script.google.com/macros/s/AKfycbxXjDN5nXVsdojTudMtChy4ts6l4fckyKZGRTa7f689IiI8giejnzys4bnlIZaL28g/exec?api=giftcodebot')
    .then(res => res.json())
    .then(json => {
        let data = json.data || json;
        let found = false;
        for(let i=0; i<data.length; i++) {
            if(data[i].some(v => String(v).includes('738952586'))) {
                console.log("Row found in giftcodebot: " + JSON.stringify(data[i]));
                found = true;
            }
        }
        if(!found) console.log("Game ID 738952586 not found in giftcodebot");
    })
    .catch(e => console.log("Error: " + e.message));
