const Meal = require('../model/mealModel');
const aqp = require('api-query-params');

exports.listAll = function (req, res, next) {
    const query = aqp.default(req.query);
    if (!req.userCan("meal.read")){
        query.filter.owner=req.user._id;
    }
    Meal.find(query.filter)
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

/**
 * POST /api/meal
 *
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @param {Function} next
 */
exports.create = function (req, res, next) {
    var meal = new Meal({
        distance: req.body.distance,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        owner: req.user._id
    });
    meal.save(function (err) {
        if (err) {
            res.status(417).json(err);
        } else {
            // Succesfully Created
            res.status(201).json({
                'message': "Created",
                'object': meal
            })
        }
    });
};

exports.listOne = function (req, res, next) {
    Meal.findById(req.params.Id, function (err, meal) {
        if (err) {
            res.status(417).json(err);
        } else if (meal) {
            // Found
            if (req.userCan('meal.read') || meal.owner.toString() == req.user.id) {
                res.json(meal);
            } else {
                //not authorized
                res.status(403).json({"message": "Not Authorized"});
            }
        } else {
            // NOT found
            res.status(404).json({"message": "Not Found"});
        }
    });
};

exports.update = function (req, res, next) {
    //Meal.findByIdAndUpdate(req.params.Id, { $set: req.body }, function (err, result) {
    Meal.findById(req.params.Id, function (err, meal) {
        if (err) {
            res.status(417).json(err);
        } else if (meal) {
            if (JSON.stringify(req.body) === '{}') {
                //nothing to change
                res.status(304).json({"message": "Nothing to Change"});
            } else {
                //update 
                if (req.userCan('meal.update') || meal.owner.toString() == req.user.id) {
                    Object.keys(req.body).forEach(function (key) {
                        meal[key] = req.body[key];
                    })
                    meal.save(function (err) {
                        if (err) {
                            res.status(417).json(err);
                        } else {
                            // Succesfully updated
                            res.status(201).json({
                                "message": "Updated",
                                "object": meal
                            }
                            );
                        }
                    })
                } else {
                    //not authorized
                    res.status(403).json({ "message": "Forbidden"});
                }
            }
        } else {
            // NOT found 
            res.status(404).json({"message": "not found"});
        }
    });


};

exports.delete = function (req, res, next) {
    // Meal.findByIdAndRemove(req.params.Id, function (err, result) {
    Meal.findById(req.params.Id, function (err, meal) {
        if (err) {
            res.status(417).json(err);
        } else if (meal) {
            if (req.userCan('meal.update') || meal.owner.toString() == req.user.id){
                //remove
                meal.remove(function (err) {
                    if (err) {
                        res.status(417).json(err);
                    } else {
                        res.status(200).json({"message": "Deleted"});
                    }
                });
            }else{
                //Not Authorized
                res.status(403).json({"message":"Forbidden"});
            }
        } else {
            // Not Found
            res.status(404).json({"message": "Not Found"});
        }
    });
};
