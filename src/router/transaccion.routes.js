import { Router } from 'express'
import {
    crearTransaccion,
    obtenerTransacciones,
    obtenerTransaccion,
    actualizarTransaccion,
    eliminarTransaccion
} from '../controller/transaccion.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/', obtenerTransacciones)
router.get('/:id', obtenerTransaccion)
router.post('/', validate('transaction'), crearTransaccion)
router.put('/:id', actualizarTransaccion)
router.delete('/:id', eliminarTransaccion)

export default router


