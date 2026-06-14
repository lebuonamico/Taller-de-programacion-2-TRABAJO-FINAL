import UserService from '../servicio/user.service.js'

const service = new UserService()

export const createUser = async (req, res, next) => {
    try {
        const user = await service.createUser(req.body)
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const result = await service.loginUser(email, password)
        res.json(result)
    } catch (error) {
        next(error)
    }
}

export const getProfile = async (req, res, next) => {
    try {
        const user = await service.getProfile(req.user.id)
        res.json(user)
    } catch (error) {
        next(error)
    }
}

