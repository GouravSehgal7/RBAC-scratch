import Express from 'express'
import {logincontroller,signupcontroller} from '../controllers/auth.controller.js'
const router = Express.Router()
// all user will login/ signup by default as viewer only admin will promote them to analyst or admin from his apis

router.post('/login',logincontroller); // all
router.post('/signup',signupcontroller); // all


export default router