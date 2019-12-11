const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models').User;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        User.findOne({ $or: [{ email: email }, { username: email }] })
            .then(async(user, err) => {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Incorrect email/username.' }); }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch && !(user.password === password)) return done(null, false, { message: 'Incorrect password.' });
                else { return done(null, user); }
            });
    }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, 'JKJKKFK-JKKSJK-LSJ465-152-SH-33', { expiresIn: 360000 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'JKJKKFK-JKKSJK-LSJ465-152-SH-33';

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_paload, done) => {
        User.findOne({ _id: jwt_paload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));

exports.verifyAdmin = (req, res, next) => {
    if (req.user.role === 'Admin') {
        next();
    } else {
        res.status(403);
        return res.json({ error: "error 403 unathorized", message: "You are not authorized to perform this operation only for admin user!" });
    }
};