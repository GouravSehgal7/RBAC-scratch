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
router.get('/',isauth,accessdashboarddataread,getcompletedata);
router.post('/',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin,ROLES.analyst]),dashboardDataValidator,createdata);
router.get('/filter-by',isauth,isStatusAllowed([STATUS.active]),isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]),filterDashboardValidator,getfiltereddata);
router.get('/paginateddata',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]),paginationValidator,paginateddataget);
// aggregated routes
router.get('/total-income',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]) ,totalincomecontroller);
router.get('/total-expance',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]) ,totalexpancecontroller);
router.get('/net-balance',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]) ,getnetbalance)
router.get('/category-wise-total',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]) ,categorywisetotalcontroller);
// monthly and weekly aggregation route
router.get('/monthly-trends',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]) , monthlytrendscontroller);
router.get('/recent-activity',isauth,isStatusAllowed([STATUS.active]), isroleallowed([ROLES.analyst]) ,recentactivitycontroller);
router.get('/getmonthlycategorytrends',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.analyst]) ,monthlycategorycontroller)
export default router