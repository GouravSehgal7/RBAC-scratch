import Express from 'express'
import {Assignroletopermission,createpermission, createrolecontroller,createrolewithpermission,deletepermission,getrolescontroller, removePermissionsFromRole} from '../controllers/roles.controller.js'
import { assignPermissionValidator, removePermissionValidator, roleWithPermissionValidator } from '../middleware/validator.js';
import { isauth } from '../middleware/isauth.js';
import { isroleallowed, isStatusAllowed } from '../middleware/accesscontrol.middleware.js';
import { ROLES, STATUS } from '../lib/constants.js';


const router = Express.Router()
// all task admin only
/**
 * @swagger
 * /api/role/v1:
 *   get:
 *     summary: Get all roles
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get('/',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),getrolescontroller);
/**
 * @swagger
 * /api/role/v1/create-role:
 *   post:
 *     summary: Create a new role
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 example: manager
 *     responses:
 *       201:
 *         description: Role created
 */
router.post('/create-role',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),createrolecontroller);
/**
 * @swagger
 * /api/role/v1/create-permission:
 *   post:
 *     summary: Create a permission
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permission
 *             properties:
 *               permission:
 *                 type: string
 *                 example: read_dashboard
 *     responses:
 *       201:
 *         description: Permission created
 */
router.post('/create-permission',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),createpermission)
/**
 * @swagger
 * /api/role/v1/create-role-with-permission:
 *   post:
 *     summary: Create role with permissions
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               role: analyst
 *               permissions: ["read_dashboard", "view_reports"]
 *     responses:
 *       201:
 *         description: Role with permissions created
 */
router.post('/create-role-with-permission',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),roleWithPermissionValidator,createrolewithpermission);
/**
 * @swagger
 * /api/role/v1/assign-permission:
 *   put:
 *     summary: Assign permission to role
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               roleId: 1
 *               permissionIds: [2, 3]
 *     responses:
 *       200:
 *         description: Permissions assigned
 */
router.put('/assign-permission',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),assignPermissionValidator,Assignroletopermission)
/**
 * @swagger
 * /api/role/v1/remove-role-permission/{id}:
 *   put:
 *     summary: Remove permission from role
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               permissionIds: [2, 3]
 *     responses:
 *       200:
 *         description: Permissions removed
 */
router.put('/remove-role-permission/:id',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),removePermissionValidator,removePermissionsFromRole)
/**
 * @swagger
 * /api/role/v1/delete-permission/{id}:
 *   delete:
 *     summary: Delete permission
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permission deleted
 */
router.delete('/delete-permission/:id',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),deletepermission)

export default router