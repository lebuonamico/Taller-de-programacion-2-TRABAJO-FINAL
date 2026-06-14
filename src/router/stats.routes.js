import { Router } from 'express'
import { obtenerEstadisticasMensuales, obtenerEstadisticasPorCategoria, obtenerTendencias } from '../controller/stats.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/monthly', obtenerEstadisticasMensuales)
router.get('/categories', obtenerEstadisticasPorCategoria)
router.get('/trends', obtenerTendencias)

export default router
