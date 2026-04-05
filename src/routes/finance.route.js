import Express from 'express'
import {
    categorywisetotalcontroller,
    createdata,
    getcompletedata,
    getfiltereddata,
    getnetbalance,
    monthlytrendscontroller,
    paginateddataget,
    recentactivitycontroller,
    totalexpancecontroller,
    totalincomecontroller,
    monthlycategorycontroller
} from '../controllers/dashboard.controller.js'
import { dashboardDataValidator, filterDashboardValidator, paginationValidator } from '../middleware/validator.js';
import { isauth } from '../middleware/isauth.js';
import { accessdashboarddataread, isroleallowed, isStatusAllowed } from '../middleware/accesscontrol.middleware.js';
import { ROLES, STATUS } from '../lib/constants.js';

const router = Express.Router()
// all are admin and analyst only
/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get complete dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched dashboard data
 */
router.get('/', isauth, accessdashboarddataread, getcompletedata);
/**
 * @swagger
 * /api/dashboard:
 *   post:
 *     summary: Create dashboard entry
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               type: income
 *               amount: 5000
 *               category: salary
 *               note: Monthly salary
 *     responses:
 *       201:
 *         description: Data created
 */
router.post('/',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin,ROLES.analyst]),dashboardDataValidator,createdata);
/**
 * @swagger
 * /api/dashboard/filter-by:
 *   get:
 *     summary: Filter dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filtered data
 */
router.get('/filter-by',isauth,isStatusAllowed([STATUS.active]),isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]),filterDashboardValidator,getfiltereddata);
/**
 * @swagger
 * /api/dashboard/paginateddata:
 *   get:
 *     summary: Get paginated dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated results
 */
router.get('/paginateddata',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]),paginationValidator,paginateddataget);
// aggregated routes
/**
 * @swagger
 * /api/dashboard/total-income:
 *   get:
 *     summary: Get total income
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total income
 */
router.get('/total-income',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]) ,totalincomecontroller);
/**
 * @swagger
 * /api/dashboard/total-expance:
 *   get:
 *     summary: Get total expense
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total expense
 */
router.get('/total-expance',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]) ,totalexpancecontroller);
/**
 * @swagger
 * /api/dashboard/net-balance:
 *   get:
 *     summary: Get net balance
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Net balance
 */
router.get('/net-balance',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]) ,getnetbalance)
/**
 * @swagger
 * /api/dashboard/category-wise-total:
 *   get:
 *     summary: Get category-wise totals
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category totals
 */
router.get('/category-wise-total',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]) ,categorywisetotalcontroller);
// monthly and weekly aggregation route
/**
 * @swagger
 * /api/dashboard/monthly-trends:
 *   get:
 *     summary: Get monthly trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly trends data
 */
router.get('/monthly-trends',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]) , monthlytrendscontroller);
/**
 * @swagger
 * /api/dashboard/recent-activity:
 *   get:
 *     summary: Get recent activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent transactions
 */
router.get('/recent-activity',isauth,isStatusAllowed([STATUS.active]), isroleallowed([ROLES.analyst]) ,recentactivitycontroller);
/**
 * @swagger
 * /api/dashboard/getmonthlycategorytrends:
 *   get:
 *     summary: Get monthly category trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly category trends
 */
router.get('/getmonthlycategorytrends',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]) ,monthlycategorycontroller)
export default router