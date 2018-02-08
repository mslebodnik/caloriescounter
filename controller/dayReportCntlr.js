const Meal = require('../model/mealModel');
const aqp = require('api-query-params');
/*
db.meals.aggregate([
    {
        $group: {
            _id: {owner: "$owner" , year: { $year: "$time" }, yearday: { $dayOfYear: "$time" } },
            totalTime: {
                $sum: {
                   $subtract: ["$endTime", "$startTime"]
                }
            },
            totalDistance: {
                 $sum: "$distance" 
            },
            count: {
                $sum: 1
            }
        }
    }
]) */

exports.listAll = function (req, res, next) {
    const query = aqp.default(req.query);
    var aggregate = [
        {
            $group: {
                _id: { owner: "$owner", year: { $year: "$time" }, yearday: { $dayOfYear: "$time" } },
                totalCalories: {
                    $sum: "$calories"
                },
                numberOfMeals: {
                    $sum: 1
                }
            }
        }
    ]
    if (!req.userCan("meal.read")) {
        query.filter.owner = req.user._id;
    }
    if (query.skip) {
        aggregate.push({ $skip: query.skip });
    }
    if (query.limit) {
        aggregate.push({ $limit: query.limit });
    }
    if (query.filter) {
        aggregate.unshift({ $match: query.filter });
    }
    Meal.aggregate(aggregate)
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