import Service from '../service/user.service.js'

class UserController {
    #service = null

    constructor() {
        this.#service = new Service()
    }

    createUser = async (req, res, next) => {
        try {
            const createdUser = await this.#service.createUser(req.body)
            res.status(201).json(createdUser)
        } catch (error) {
            next(error)
        }
    }

    loginUser = async (req, res, next) => {
        try {
            const { email, password } = req.body
            const user = await this.#service.loginUser(email, password)
            res.json(user)
        } catch (error) {
            next(error)
        }
    }

    getProfile = async (req, res, next) => {
        try {
            const user = await this.#service.getProfile(req.user.id)
            res.json(user)
        } catch (error) {
            next(error)
        }
    }

    updateProfile = async (req, res, next) => {
        try {
            const updatedUser = await this.#service.updateProfile(req.user.id, req.body)
            res.json(updatedUser)
        } catch (error) {
            next(error)
        }
    }

    deleteProfile = async (req, res, next) => {
        try {
            await this.#service.deleteProfile(req.user.id)
            res.json({ mensaje: 'Usuario eliminado correctamente' })
        } catch (error) {
            next(error)
        }
    }
}

export default UserController