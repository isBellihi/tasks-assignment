const express = require('express');
const app = express();

app.get('/path', (req, res) => {
    res.json('Hello Word 2!');
});


module.exports = app;