fetch('https://script.google.com/macros/s/AKfycbxXjDN5nXVsdojTudMtChy4ts6l4fckyKZGRTa7f689IiI8giejnzys4bnlIZaL28g/exec?api=giftcodebot')
    .then(res => res.json())
    .then(json => {
        let data = json.data || json;
        if (data.error) {
           console.log("Error from API: " + data.error);
        } else if (data && data.length > 0) {
           console.log("giftcodebot sheet found! Rows: " + data.length);
           console.log("Row 0: " + JSON.stringify(data[0]));
           console.log("Row 1: " + JSON.stringify(data[1]));
        } else {
           console.log("No data returned.");
        }
    })
    .catch(e => console.log("Error: " + e.message));
