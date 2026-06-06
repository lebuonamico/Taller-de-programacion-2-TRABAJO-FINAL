import express from 'express'
import authMiddleware
    from '../middleware/auth.middleware.js'
import Controller from '../controller/user.controller.js'

class Router {
    #controller = null

    constructor() {
        this.#controller = new Controller()
    }

    config() {
        const router = express.Router()

        router.post(
            '/register',
            this.#controller.createUser
        )
        router.post(
            '/login',
            this.#controller.loginUser
        )
        router.get(
            '/profile',
            authMiddleware,
            this.#controller.getProfile
        )
        router.put(
            '/profile',
            authMiddleware,
            this.#controller.updateProfile
        )
        router.delete(
            '/profile',
            authMiddleware,
            this.#controller.deleteProfile
        )
        return router
    }
}

export default Router