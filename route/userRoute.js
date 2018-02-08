const userCntlr = require('../controller/userCntlr');
const router = require('express').Router();
const role = require('../controller/userRoles');
const allowedMethods = require('allow-methods');


router.route('/')
  .all(allowedMethods(['GET', 'HEAD']))
/**
 * @api {get} /api/user List All User Records
 * @apiName UserList
 * @apiGroup User
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
  .get(userCntlr.listAll)

/**
 * @api {post} /api/user Create New User Records
 * @apiName UserCreate
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization: JWT <token>
 * 
* @apiParam {String}        username 
* @apiParam {String}        password 
* @apiParam {String}        role [USER,MANAGER,ADMIN] 
 *
 * @apiSuccess (201) {String}  Message "OK"
 * @apiSuccess (201) {Number}  userid ID of created User
 * 
 * @apiError (401) Authorization Failed
 * @apiError (403) Forbiden Only roles MANAGER,ADMIN can create user
 * @apiError (417) Validation Error 
 */
  .post(role.can('user.all'), userCntlr.create);

router.route('/:Id')
  .all(role.can('user.access'), allowedMethods(['GET', 'HEAD', 'PUT', 'DELETE']))
/**
 * @api {get} /api/meal/:ID List User Records
 * @apiName UserListOne
 * @apiGroup User
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
  .get(userCntlr.listOne)

/**
 * @api {Put} /api/meal/:Id Update User Records
 * @apiName UserUpdate
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization: JWT <token>
 * 
* @apiParam {Number}        Id  User Id

* @apiParam {String}        username 
* @apiParam {String}        password 
* @apiParam {String}        role [USER,MANAGER,ADMIN] 
*
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
  .put(userCntlr.update)
/**
 * @api {delete} /api/meal/:Id delete User Records
 * @apiName UserDelete
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization: JWT <token>
 * 
* @apiParam {Number}        Id  User Id
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
  .delete(userCntlr.delete);
module.exports = router;