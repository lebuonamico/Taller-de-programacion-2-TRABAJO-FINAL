import { Router } from 'express'
import { obtenerEstadisticasMensuales, obtenerEstadisticasPorCategoria, obtenerTendencias } from '../controller/stats.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/monthly', validate('monthlyStats', 'query'), obtenerEstadisticasMensuales)
router.get('/categories', validate('categoryStats', 'query'), obtenerEstadisticasPorCategoria)
router.get('/trends', validate('trends', 'query'), obtenerTendencias)

export default router
