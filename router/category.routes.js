import express from 'express'
import authMiddleware
    from '../middleware/auth.middleware.js'
import Controller from '../controller/category.controller.js'

class Router {
    #controller = null

    constructor() {
        this.#controller = new Controller()
    }

    config() {
        const router = express.Router()

        router.get(
            '/',
            authMiddleware,
            this.#controller.getCategories
        )
        router.post(
            '/',
            authMiddleware,
            this.#controller.createCategory
        )
        router.put(
            '/:id',
            authMiddleware,
            this.#controller.updateCategory
        )
        router.delete(
            '/:id',
            authMiddleware,
            this.#controller.deleteCategory
        )
        return router
    }
}

export default Router
