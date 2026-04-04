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

const router = Express.Router()
// all are admin and analyst only
router.get('/',getcompletedata);
router.post('/',dashboardDataValidator,createdata);
router.get('/filter-by',filterDashboardValidator,getfiltereddata);
router.get('/paginateddata',paginationValidator,paginateddataget);
// aggregated routes
router.get('/total-income',totalincomecontroller);
router.get('/total-expance',totalexpancecontroller);
router.get('/net-balance',getnetbalance)
router.get('/category-wise-total',categorywisetotalcontroller);
// monthly and weekly aggregation route
router.get('/monthly-trends', monthlytrendscontroller);
router.get('/recent-activity', recentactivitycontroller);
router.get('/getmonthlycategorytrends',monthlycategorycontroller)
export default router