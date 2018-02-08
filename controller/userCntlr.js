const User = require('../model/userModel');
const async = require('async');
const aqp = require('api-query-params');

exports.listAll = function (req, res, next) {
    const query = aqp.default(req.query);
    if (!req.userCan("user.all")){
        query.filter._id=req.user._id;
    }
    User.find(query.filter)
        .skip(query.skip)
        .limit(query.limit)
        .sort(query.sort)
        .exec((err, meals) => {
            if (err) {
                res.status(417).json(err);
            } else if (meals.length == query.limit) {
                res.status(206).json(meals);
            } else {
                res.status(200).json(meals);
            }
        });
};

exports.create = function (req, res, next) {
    var user=new User({ username: req.body.username , role: req.body.role});
    User.register(user, req.body.password, function (err) {
        if (err) {
            res.status(417).json(err);
        } else {
            res.status(201).json({"message": "created", "user_id":  user._id });
        }
    });
};

exports.listOne = function (req, res, next) {
    User.findById(req.params.Id, function (err, user) {
        if (err) {
            res.status(417).json(err);
        } else if (user) {
            res.json(user);
        } else {
            // NOT found
            res.status(404).json({"message": "Not Found"});
        }
    });
};

exports.update = function (req, res, next) {
    User.findById(req.params.Id, function (err, user) {
        if (err) {
            //validation error
            res.status(417).json(err);
        } else if (user) {
            //empty request
            if (JSON.stringify(req.body) === '{}') {
                res.status(304).json({"message": "Nothing to change"});
            } else {
                //update user
                async.parallel({
                    "all": function (done) {
                        Object.keys(req.body).forEach(function (key) {
                            user[key] = req.body[key];
                        })
                        done();
                    },
                    //check for password changed
                    "password_check": function (done) {
                        if (req.body.password) {
                            user.setPassword(req.body.password,done(err,result));
                            user.increment();
                        }else{
                            done(null,null);
                        }
                    },
                    //Only manager or Admin can change role
                    "role_check": function (done) {
                        if (req.body.role) {
                            if (req.userCan('user.all')) {
                                user.increment();
                                done(null, null);
                            } else {
                                done(new Error("Not Allowed to change ROLES"));
                            }
                        }else{
                            done(null,null);
                        }
                    },

                },
                    function (err, result) {
                        if(err){
                                res.status(417).json(err);
                        }else{
                            user.save(function(err){
                                if (err) {
                                    res.status(417).json(err);
                                } else {
                                    // Succesfully updated
                                    res.status(201).json({"message": "Updated"});
                                }
                            })
                        }
                    }
                )
            }
        } else {
            // NOT found 
            res.send(404).json({"message": "Not Found"});
        }
    });
};

exports.delete = function (req, res, next) {
    User.findByIdAndRemove(req.params.Id, function (err, user) {
        if (err) {
            res.status(417).json(err);
        } else if (user) {
            res.status(204).json({"message": "Deleted"});
        } else {
            res.status(404).json({"message": "Not Found"});
        }
    });
};