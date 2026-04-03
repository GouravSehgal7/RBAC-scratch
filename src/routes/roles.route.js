import Express from 'express'
import {Assignroletopermission,createpermission, createrolecontroller,createrolewithpermission,deletepermission,getrolescontroller, removePermissionsFromRole} from '../controllers/roles.controller.js'


const router = Express.Router()
// all task admin only
router.get('/',getrolescontroller);
router.post('/create-role',createrolecontroller);
router.post('/create-permission',createpermission)
router.post('/create-role-with-permission',createrolewithpermission);
router.put('/assign-permission',Assignroletopermission)
router.put('/remove-role-permission/:id',removePermissionsFromRole)
router.delete('/delete-permission/:id',deletepermission)

export default router