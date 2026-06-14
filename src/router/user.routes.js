import { Router } from 'express'
import { createUser, loginUser, getProfile } from '../controller/user.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'

const router = Router()

router.post('/register', validate('register'), createUser)
router.post('/login', validate('login'), loginUser)
router.get('/profile', authMiddleware, getProfile)

export default router

