const cfg = require('config');
const request = require('request');


/**
 *  Get Calories for meal
 * 
 * @param {MealModel} meal 
 * @param {function} callback (error,MealModel)
 */

function getCalories(meal, cb) {
    if(!meal){
        cb(new Error("Meal Object not Defined"));
    } else if (meal.meal) {
        cb(null, meal)
    } else {
        cb(new Error('No Meal Set'), meal);
    }
}

/**
 * Get JSON Nutrition data from API
 * 
 * @param {MealModel} meal 
 * @param {function} callback (err, jsonNutritionData )
 */
function getNutritionData(meal, cb) {
    //API description
    // https://developer.nutritionix.com/docs/v2
    var options = {
        url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
        headers: {
            'Content-Type': 'application/json',
            'x-app-id': cfg.NutriAppAPI,
            'x-app-key': cfg.NutriKeyAPI
        },

    };
    var query = meal.meal; 
    request.post({ url: base_url, json: {'query': meal.meal, 'aggregate': 'y'} }, function (error, response, body) {
        if (error) {
            cb(error, null)
        } else if (response.statusCode === 200) {
            console.log('get Nutrition Data sucessfull for  id: %s', meal._id);
            cb(null, body);
        } else {
            cb(new Error('can not get Nutrition Data'), null);
        }
    })
}

/**
 * Get JSON Nutrition Meal Data
 * 
 * @param {MealModel} meal 
 * @param {function} callback (err, jsonNutritionData )
 */

module.exports = function (req, cb) {
    getCalories(req, (err, meal) => {
        if (err) {
            cb(err, null)
        } else {
          getNutritionData(meal, (error, result) => {
                cb(error, result)
            })
        }
    })
}