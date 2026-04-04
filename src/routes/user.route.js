import Express from 'express';
import { getallusercontroller,getuserbyidcontroller,updaterolecontroller,updateuserstatuscontroller,transferownership } from "../controllers/user.controller.js";
import { ownershipValidator, updateRoleValidator, updateStatusValidator } from '../middleware/validator.js';



const router = Express.Router()

// router.get('/',getallusercontroller); // admin, analyst 
router.get('/:id/',getuserbyidcontroller); // admin, analyst
router.patch('/update-status',updateStatusValidator,updateuserstatuscontroller); // admin
router.patch('/update-role',updateRoleValidator,updaterolecontroller); //admin
router.post('/transfer-ownership',ownershipValidator,transferownership)
export default router