import User from '../modelo/User.js'
import ModelFactory from '../modelo/DAO/modelFactory.js'
import config from '../config.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/jwt.js'

class UserService {
    #modelo = null

    constructor() {
        const modo = config.MODO_PERSISTENCIA
        this.#modelo = ModelFactory.get(modo)
    }

    createUser = async user => {

        const newUser = new User(user)

        newUser.validate()

        const existingUser =
            await this.#modelo.findByEmail(
                newUser.email
            )

        if (existingUser) {
            throw new Error('Email already exists')
        }
        const hashedPassword =
            await bcrypt.hash(
                newUser.password,
                10
            )

        newUser.password = hashedPassword

        await this.#modelo.create(
            newUser.toPersistence()
        )

        return newUser.toJSON()
    }
    loginUser = async (email, password) => {

        const user =
            await this.#modelo.findByEmail(email)

        if (!user) {
            throw new Error('Invalid credentials')
        }

        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            )

        if (!validPassword) {
            throw new Error('Invalid credentials')
        }

        const token = generateToken({
            id: user._id,
            email: user.email
        })

        return { token }
    }

    getProfile = async id => {

    const user =
        await this.#modelo.findById(id)

    if (!user) {
        throw new Error('User not found')
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email
    }
}
}

export default UserService
