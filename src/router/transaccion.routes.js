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

router.get('/', validate('transactionFilters', 'query'), obtenerTransacciones)
router.get('/:id', validate('objectId', 'params'), obtenerTransaccion)
router.post('/', validate('transaction'), crearTransaccion)
router.put('/:id', validate('objectId', 'params'), validate('transactionUpdate'), actualizarTransaccion)
router.delete('/:id', validate('objectId', 'params'), eliminarTransaccion)

export default router

