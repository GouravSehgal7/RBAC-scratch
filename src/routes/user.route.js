import Express from 'express';
import { getallusercontroller,getuserbyidcontroller,updaterolecontroller,updateuserstatuscontroller,transferownership } from "../controllers/user.controller.js";



const router = Express.Router()

// router.get('/',getallusercontroller); // admin, analyst 
router.get('/:id/',getuserbyidcontroller); // admin, analyst
router.patch('/update-status',updateuserstatuscontroller); // admin
router.patch('/update-role',updaterolecontroller); //admin
router.post('/transfer-ownership',transferownership)
export default router