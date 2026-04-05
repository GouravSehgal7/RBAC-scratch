import Express from 'express';
import { getallusercontroller,getuserbyidcontroller,updaterolecontroller,updateuserstatuscontroller,transferownership } from "../controllers/user.controller.js";
import { ownershipValidator, updateRoleValidator, updateStatusValidator } from '../middleware/validator.js';
import { ROLES,STATUS } from '../lib/constants.js';
import { isauth } from '../middleware/isauth.js';
import { isStatusAllowed,isroleallowed } from '../middleware/accesscontrol.middleware.js';


const router = Express.Router()

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Accessible by Admin and Analyst
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin,ROLES.analyst]),getallusercontroller); // admin, analyst 
/**
 * @swagger
 * /api/users/getone:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     description: Accessible by Admin and Analyst
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/getone',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin,STATUS.analyst]),getuserbyidcontroller); // admin, analyst
/**
 * @swagger
 * /api/users/update-status:
 *   patch:
 *     summary: Update user status
 *     tags: [Users]
 *     description: Admin only
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               userId: 1
 *               status: active
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/update-status',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),updateStatusValidator,updateuserstatuscontroller); // admin
/**
 * @swagger
 * /api/users/update-role:
 *   patch:
 *     summary: Update user role
 *     tags: [Users]
 *     description: Admin only
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               userId: 1
 *               role: analyst
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch('/update-role',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),updateRoleValidator,updaterolecontroller); //admin
/**
 * @swagger
 * /api/users/transfer-ownership:
 *   post:
 *     summary: Transfer ownership between users
 *     tags: [Users]
 *     description: Admin only
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               from: old@mail.com
 *               to: new@mail.com
 *     responses:
 *       200:
 *         description: Ownership transferred
 */
router.post('/transfer-ownership',isauth,isStatusAllowed([STATUS.active]),isroleallowed([ROLES.admin]),ownershipValidator,transferownership)
export default router