const router = require('express').Router();
const mealCntlr = require('../controller/mealCntlr');
const allowedMethods = require('allow-methods');

router.route('/')
    .all(allowedMethods(['GET', 'POST']))
/**
 * @api {get} /api/meal List All Meal Records
 * @apiName MealList
 * @apiGroup Meal
 * 
 * @apiHeader {String} Authorization: JWT <token>
 * 
 * @apiParam {QueryFilter} QueryFilter see https://www.npmjs.com/package/api-query-params 
 *
 * @apiSuccess (200) {Object}  Complete Object 
 * @apiSuccess (206) {Object}  Partial Object Next Pagination needed
 * 
 * @apiError (401) Authorization Failed
 * @apiError (417) Validation Error 
 */
    .get(mealCntlr.listAll)

/**
 * @api {post} /api/meal Create New Meal Records
 * @apiName MealCreate
 * @apiGroup Meal
 * 
 * @apiHeader {String} Authorization: JWT <token>
 * 
* @apiParam {String}        distance 
* @apiParam {Date}        startTime
* @apiParam {Date}        endTime
* @apiParam {String}        address
* @apiParam {Number}        latitude
* @apiParam {Number}        longitude
 *
 * @apiSuccess (201) {String}  Message "OK"
 * @apiSuccess (201) {Object}  object created object
 * 
 * @apiError (401) Authorization Failed
 * @apiError (417) Validation Error 
 */
    .post(mealCntlr.create);

router.route('/:Id')
    .all(allowedMethods(['GET', 'PUT', 'DELETE']))
/**
 * @api {get} /api/meal/:ID List Meal Records
 * @apiName MealListOne
 * @apiGroup Meal
 * 
 * @apiHeader {String} Authorization: JWT <token>
 * 
 * @apiParam {ID} Object ID 
 *
 * @apiSuccess (200) {Object}  Complete Object 
 * 
 * @apiError (401) Authorization Failed
 * @apiError (403) Forbidden
 * @apiError (404) Not Found
 * @apiError (417) Validation Error 
 */
    .get(mealCntlr.listOne)

/**
 * @api {Put} /api/meal/:Id Update Meal Records
 * @apiName MealUpdate
 * @apiGroup Meal
 * 
 * @apiHeader {String} Authorization: JWT <token>
 * 
* @apiParam {Number}        Id  Meal Id
*
* @apiParam {String}        distance 
* @apiParam {Date}        startTime
* @apiParam {Date}        endTime
* @apiParam {String}        address
* @apiParam {Number}        latitude
* @apiParam {Number}        longitude
 *
 * @apiSuccess (201) {String}  Message "Updated"
 * @apiSuccess (201) {Object}  object created object
 * 
 * @apiSuccess (304) {String}  Message "Nothing to update"
 * 
 * @apiError (401) Authorization Failed
 * @apiError (403) Forbidden
 * @apiError (404) Not Found
 * @apiError (417) Validation Error 
 */
    .put(mealCntlr.update)

/**
 * @api {delete} /api/meal/:Id delete Meal Records
 * @apiName MealDelete
 * @apiGroup Meal
 * 
 * @apiHeader {String} Authorization: JWT <token>
 * 
* @apiParam {Number}        Id  Meal Id
*
 * @apiSuccess (201) {String}  Message "Updated"
 * @apiSuccess (201) {Object}  object created object
 * 
 * @apiSuccess (304) {String}  Message "Nothing to update"
 * 
 * @apiError (401) Authorization Failed
 * @apiError (403) Forbidden
 * @apiError (404) Not Found
 * @apiError (417) Validation Error 
 */
    .delete(mealCntlr.delete);

module.exports = router;