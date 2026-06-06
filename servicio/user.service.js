import User from '../model/user/User.js'
import ModelFactory from '../model/DAO/modelFactory.js'
import config from '../config.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/jwt.js'
import UpdateUser from '../model/user/UpdateUser.js'

class UserService {
    #model = null

    constructor() {
        const modo = config.MODO_PERSISTENCIA
        this.#model = ModelFactory.get(modo)
    }

    async createUser(user) {

        const newUser = new User(user)

        newUser.validate()

        const existingUser =
            await this.#model.findByEmail(
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

        await this.#model.create(
            newUser.toPersistence()
        )

        return newUser.toJSON()
    }

    async loginUser(email, password) {

        const user =
            await this.#model.findByEmail(email)

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

    async getProfile(id) {

        const user =
            await this.#model.findById(id)

        if (!user) {
            throw new Error('User not found')
        }

        return {
            id: user._id,
            name: user.name,
            email: user.email
        }
    }

    async updateProfile(id, data) {

        UpdateUser.validate(data)

        const user =
            await this.#model.findById(id)

        if (!user) {
            throw new Error('User not found')
        }

        if (data.name) {
            user.name = data.name
        }

        if (data.password) {
            user.password =
                await bcrypt.hash(
                    data.password,
                    10
                )
        }

        const updatedUser =
            await this.#model.updateUser(
                id,
                user
            )

        return {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        }
    }

    async deleteProfile(id) {

        const user =
            await this.#model.findById(id)

        if (!user) {
            throw new Error('User not found')
        }

        await this.#model.deleteUser(id)
    }
}

export default UserService