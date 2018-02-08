const apiRouter = require('express').Router();
const requireAuth = require('passport').authenticate('jwt', { session: false });


/**
 * @api {post} /api/login Login user
 * @apiName UserLogin
 * @apiGroup User
 *
 * @apiParam {String} username 
 * @apiParam {String} password  
 * 
 * @apiSuccess (200) {String} message "ok"
 * @apiSuccess (200) {String} token Authorization JWT token
 * 
 * @apiError (401) Authorization Failed
 * @apiError (417) Validation Error 
 */
apiRouter.post('/login', require('../controller/authCntlr').login);

/**
 * @api {get} /api/logout Logout user
 * @apiName UserLogout
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization: JWT <token>
 *
 * @apiSuccess (200) {String} message "ok"
 * 
 * @apiError (401) Authorization Failed
 * @apiError (417) Validation Error 
 */
apiRouter.use('/logout', require('../controller/authCntlr').logout);

/**
 * @api {post} /api/register Login user
 * @apiName UserRegister
 * @apiGroup User
 *
 * @apiParam {String} username 
 * @apiParam {String} password  
 * 
 * @apiSuccess (201) {String} message "ok"
 * @apiSuccess (201) {String} user_id id of user
 * 
 * @apiError (417) Validation Error 
 */
apiRouter.post('/register', require('../controller/userCntlr').create);

/**
 * @api {get} /api/weekreport Logout user
 * @apiName WeekReport
 * @apiGroup Week
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
apiRouter.get('/weekreport',requireAuth,require('../controller/weekCntlr').listAll)
apiRouter.use('/meal', requireAuth, require('./mealRoute'));


apiRouter.use('/user', requireAuth, require('./userRoute'));
apiRouter.use('*', function (req, res) {
        res.status(405).json({ 'message': 'Request not Allowed' });
});

module.exports=apiRouter;