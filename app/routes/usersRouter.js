const express = require('express');
const router = express.Router();
const User = require('../models').User;
const authenticate = require('../middlewares/authenticate');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/', passport.authenticate('jwt', { session: false }), authenticate.verifyAdmin, (req, res) => {
    User.find({})
        .populate('tasks')
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({
                error: "error 500",
                message: "Internal server error"
            });
        });
});

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOne({ _id: req.params.id })
        .populate('tasks')
        .then(users => {
            res.json(users);
        });
});

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            res.statusCode = 500;
            return res.json({ error: 'error 500', message: 'Internal server error' });
        } else {
            req.body.password = hash;
            User.create(req.body)
                .then(user => {
                    const token = authenticate.getToken({ _id: user._id });
                    res.json({
                        user: user,
                        token: token
                    });
                })
                .catch(err => {
                    res.json(err);
                });
        }
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            res.statusCode = 401;
            return res.json({ error: "Authentication failed", "message": info.message });
        }
        const token = authenticate.getToken({ _id: user._id });
        res.statusCode = 200;
        user.password = undefined;
        res.json({
            token: token,
            user: user
        });
    })(req, res, next);
});

module.exports = router;