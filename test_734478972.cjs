const urls = [
    'https://script.google.com/macros/s/AKfycbxXjDN5nXVsdojTudMtChy4ts6l4fckyKZGRTa7f689IiI8giejnzys4bnlIZaL28g/exec?api=Chief%27s%20List',
    'https://script.google.com/macros/s/AKfycbxXjDN5nXVsdojTudMtChy4ts6l4fckyKZGRTa7f689IiI8giejnzys4bnlIZaL28g/exec?api=giftcodebot'
];

Promise.all(urls.map(u => fetch(u).then(r => r.json())))
    .then(results => {
        results.forEach((json, idx) => {
            let data = json.data || json;
            let found = false;
            for(let i=0; i<data.length; i++) {
                if(data[i].some(v => String(v).includes('734478972'))) {
                    console.log(`Row found in sheet ${idx}: ` + JSON.stringify(data[i]));
                    found = true;
                }
            }
            if(!found) console.log(`Game ID 734478972 not found in sheet ${idx}`);
        });
    })
    .catch(e => console.log("Error: " + e.message));
