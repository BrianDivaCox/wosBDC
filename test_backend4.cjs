fetch('https://script.google.com/macros/s/AKfycbxXjDN5nXVsdojTudMtChy4ts6l4fckyKZGRTa7f689IiI8giejnzys4bnlIZaL28g/exec?api=Chief%27s%20List')
    .then(res => res.json())
    .then(json => {
        console.log("Total rows in Chief's List: " + json.length);
        console.log("Row 0 (Headers): " + JSON.stringify(json[0]));
    })
    .catch(e => console.log("Error: " + e.message));
