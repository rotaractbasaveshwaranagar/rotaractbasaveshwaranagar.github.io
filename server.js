'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/echo/test', (req, res) => {
    res.send('test');
});

var server = app.listen(PORT, HOST, function() {
    console.log(`Running on http://${HOST}:${PORT}`);    
});
module.exports = server;