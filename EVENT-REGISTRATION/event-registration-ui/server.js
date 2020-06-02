const express = require('express')
const path = require('path')

const app = express()

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/FrontEnd'));
app.get('/*', function (req, res) {

    res.sendFile(path.join(__dirname + '/dist/FrontEnd/index.html'));
});

app.listen(8081, () => { console.log("Serving static files") })