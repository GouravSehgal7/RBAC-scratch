import Express from 'express'
import {Assignroletopermission,createpermission, createrolecontroller,createrolewithpermission,deletepermission,getrolescontroller, removePermissionsFromRole} from '../controllers/roles.controller.js'
import { assignPermissionValidator, removePermissionValidator, roleWithPermissionValidator } from '../middleware/validator.js';


const router = Express.Router()
// all task admin only
router.get('/',getrolescontroller);
router.post('/create-role',createrolecontroller);
router.post('/create-permission',createpermission)
router.post('/create-role-with-permission',roleWithPermissionValidator,createrolewithpermission);
router.put('/assign-permission',assignPermissionValidator,Assignroletopermission)
router.put('/remove-role-permission/:id',removePermissionValidator,removePermissionsFromRole)
router.delete('/delete-permission/:id',deletepermission)

export default router