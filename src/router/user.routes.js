import { Router } from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'
import Controller from '../controller/user.controller.js'

const router = Router()
const controller = new Controller()

router.post('/register', validate('register'), controller.createUser)
router.post('/login', validate('login'), controller.loginUser)
router.get('/profile', authMiddleware, controller.getProfile)
router.put('/profile', authMiddleware, validate('updateUser'), controller.updateProfile)
router.delete('/profile', authMiddleware, controller.deleteProfile)

export default router