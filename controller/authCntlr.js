const passport = require('passport');
const cfg = require('config');
const jwt = require('jwt-simple');
const User = require('../model/userModel')

exports.logout = function (req, res, next) {
    //increment version to invalidate JWT token
    User.findById(req.user._id,function(err,user){
        user.increment();
        user.save();
    });
    req.logout();
    res.status(200).json({"message": "OK"});
};

exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            res.status(417).json(err);
        } else if (!user) {
            res.status(401).json({
                "message": "Unauthorized"
            })
            ;
        } else {
            //user has authenticated correctly thus we create a JWT token 
            var data = {
                'id': user._id,
                //increment version for logout
                //password and role change
                'version': user.__v,
                //JWT token expiration
                'nbf': (Date.now() / 1000),
                'exp': ((Date.now() / 1000) + cfg.JWTExpire)
            }
            var token = jwt.encode(data, cfg.JWTtokenSecret);
            res.json({ 'message': 'ok', 'token': token });
        }
    })(req, res, next);
}