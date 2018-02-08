const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cfg = require('config');
const User = require('../model/userModel');

const jwtOptions = {
    secretOrKey: cfg.JWTtokenSecret,
    ignoreExpiration: false,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

passport.use(new JwtStrategy(jwtOptions, function (jwtPayload, next) {
    User.findById(jwtPayload.id, function (err, user) {
        if (err) {
            return next(null, false);
        }
        // jwtPaylooad version incremented
        // after password change, logout, ROLE change
        if (user && user.__v === jwtPayload.version) {
            next(null, user);
        } else {
            next(null, false);
        }
    });
})
)

// Configure passport-local to use account model for authentication
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

module.exports = passport;