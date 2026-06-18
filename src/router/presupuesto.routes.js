import { Router } from 'express'
import {
    crearPresupuesto,
    obtenerPresupuestos,
    actualizarPresupuesto,
    eliminarPresupuesto
} from '../controller/presupuesto.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/', validate('budgetFilters', 'query'), obtenerPresupuestos)
router.post('/', validate('budget'), crearPresupuesto)
router.put('/:id', validate('objectId', 'params'), validate('budgetUpdate'), actualizarPresupuesto)
router.delete('/:id', validate('objectId', 'params'), eliminarPresupuesto)

export default router

