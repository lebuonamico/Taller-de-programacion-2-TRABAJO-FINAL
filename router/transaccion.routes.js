import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import Controller from '../controller/transaccion.controller.js'

class TransaccionRouter {
    #controller = null

    constructor() {
        this.#controller = new Controller()
    }

    config() {
        const router = express.Router()

        router.use(authMiddleware)

        router.get('/', this.#controller.obtenerTransacciones)
        router.get('/:id', this.#controller.obtenerTransaccion)
        router.post('/', this.#controller.crearTransaccion)
        router.put('/:id', this.#controller.actualizarTransaccion)
        router.delete('/:id', this.#controller.eliminarTransaccion)

        return router
    }
}

export default TransaccionRouter
