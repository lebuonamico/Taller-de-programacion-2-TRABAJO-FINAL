import { Router } from 'express'
import { obtenerCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from '../controller/categoria.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/', obtenerCategorias)
router.post('/', validate('category'), crearCategoria)
router.put('/:id', validate('category'), actualizarCategoria)
router.delete('/:id', eliminarCategoria)

export default router

