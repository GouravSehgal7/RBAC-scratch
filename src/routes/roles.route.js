import Express from 'express'
import {Assignroletopermission,createpermission, createrolecontroller,createrolewithpermission,deletepermission,getrolescontroller, removePermissionsFromRole} from '../controllers/roles.controller.js'
import { assignPermissionValidator, removePermissionValidator, roleWithPermissionValidator } from '../middleware/validator.js';
import { isauth } from '../middleware/isauth.js';
import { isroleallowed, isStatusAllowed } from '../middleware/accesscontrol.middleware.js';
import { ROLES, STATUS } from '../lib/constants.js';


const router = Express.Router()
// all task admin only
router.get('/',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),getrolescontroller);
router.post('/create-role',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),createrolecontroller);
router.post('/create-permission',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),createpermission)
router.post('/create-role-with-permission',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),roleWithPermissionValidator,createrolewithpermission);
router.put('/assign-permission',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),assignPermissionValidator,Assignroletopermission)
router.put('/remove-role-permission/:id',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),removePermissionValidator,removePermissionsFromRole)
router.delete('/delete-permission/:id',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),deletepermission)

export default router