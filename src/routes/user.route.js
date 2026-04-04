import Express from 'express';
import { getallusercontroller,getuserbyidcontroller,updaterolecontroller,updateuserstatuscontroller,transferownership } from "../controllers/user.controller.js";
import { ownershipValidator, updateRoleValidator, updateStatusValidator } from '../middleware/validator.js';
import { ROLES,STATUS } from '../lib/constants.js';
import { isauth } from '../middleware/isauth.js';


const router = Express.Router()

router.get('/',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin,ROLES.analyst]),getallusercontroller); // admin, analyst 
router.get('/getone',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin,STATUS.analyst]),getuserbyidcontroller); // admin, analyst
router.patch('/update-status',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),updateStatusValidator,updateuserstatuscontroller); // admin
router.patch('/update-role',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),updateRoleValidator,updaterolecontroller); //admin
router.post('/transfer-ownership',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),ownershipValidator,transferownership)
export default router