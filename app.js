const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/path', (req, res) => {
    res.send('Hello Word 2!');
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});