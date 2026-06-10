import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import Controller from '../controller/presupuesto.controller.js'

class PresupuestoRouter {
    #controller = null

    constructor() {
        this.#controller = new Controller()
    }

    config() {
        const router = express.Router()

        router.use(authMiddleware)

        router.get('/', this.#controller.obtenerPresupuestos)
        router.post('/', this.#controller.crearPresupuesto)
        router.put('/:id', this.#controller.actualizarPresupuesto)
        router.delete('/:id', this.#controller.eliminarPresupuesto)

        return router
    }
}

export default PresupuestoRouter
