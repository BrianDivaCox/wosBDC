fetch('https://script.google.com/macros/s/AKfycbxXjDN5nXVsdojTudMtChy4ts6l4fckyKZGRTa7f689IiI8giejnzys4bnlIZaL28g/exec?api=Chief%27s%20List')
    .then(res => res.json())
    .then(json => {
        let data = json.data || json;
        console.log("Col headers: " + JSON.stringify(data[2]));
        console.log("Row 3: " + JSON.stringify(data[3]));
    })
    .catch(e => console.log("Error: " + e.message));
