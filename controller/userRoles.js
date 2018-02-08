const ConnectRoles = require('connect-roles');
const userAuth = require('passport');

const roles = new ConnectRoles({
    failureHandler: function (req, res, action) {
        res.send(403).json({"message" : "Forbidden"});
    }
});

//admin users can access all endpoints
roles.use(function (req) {
    if (req.user.role === 'ADMIN') {
        return true;
    }
});

roles.use('user.access', '/:userID', function (req) {
    if (req.params.userID === req.user.id || req.user.role === 'MANAGER') {
        return true;
    };
});

roles.use('user.all', function (req) {
    if (req.user.role === 'MANAGER') {
        return true
    }
});

module.exports = roles;