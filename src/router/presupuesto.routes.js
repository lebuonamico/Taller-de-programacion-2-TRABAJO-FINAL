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

router.get('/', obtenerPresupuestos)
router.post('/', validate('budget'), crearPresupuesto)
router.put('/:id', actualizarPresupuesto)
router.delete('/:id', eliminarPresupuesto)

export default router


