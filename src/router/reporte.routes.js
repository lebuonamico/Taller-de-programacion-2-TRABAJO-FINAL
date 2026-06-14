import { Router } from 'express'
import { enviarReporte } from '../controller/reporte.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'

const router = Router()

router.use(authMiddleware)

router.post('/send', validate('report'), enviarReporte)

export default router
