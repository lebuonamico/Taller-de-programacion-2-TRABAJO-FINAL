import { Router } from 'express'
import { obtenerEstadisticasMensuales, obtenerEstadisticasPorCategoria, obtenerTendencias, obtenerEstadisticasPresupuestos } from '../controller/stats.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/monthly', validate('monthlyStats', 'query'), obtenerEstadisticasMensuales)
router.get('/categories', validate('categoryStats', 'query'), obtenerEstadisticasPorCategoria)
router.get('/trends', validate('trends', 'query'), obtenerTendencias)
router.get('/budgets', validate('budgetStats', 'query'), obtenerEstadisticasPresupuestos)

export default router
