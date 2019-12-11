const app = require("./app")
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var connect = mongoose.connect('mongodb://mongo:27017/assignment', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
connect.then(() => {
    console.log('Connect correctly to the server !');
}, (err) => console.log('Cannot connect to the server !'));
app.listen(3000, '0.0.0.0', () => {
    console.log("Server has started!")
})