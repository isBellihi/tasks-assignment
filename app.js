const express = require('express');
const app = express();
const userRouter = require('./app/routes/usersRouter');
const taskRouter = require('./app/routes/tasksRouter');
const bodyParser = require('body-parser');
const passport = require('passport');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/tasks', passport.authenticate('jwt', { session: false }), taskRouter);
app.use('*', (req, res, next) => {
    res.statusCode = 404;
    res.json({ erro: "error 404", message: "not found" });
});
module.exports = app;