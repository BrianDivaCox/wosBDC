fetch('https://script.google.com/macros/s/AKfycbxXjDN5nXVsdojTudMtChy4ts6l4fckyKZGRTa7f689IiI8giejnzys4bnlIZaL28g/exec?api=Chief%27s%20List')
    .then(res => res.json())
    .then(json => {
        console.log(JSON.stringify(json).substring(0, 500));
    })
    .catch(e => console.log("Error: " + e.message));
