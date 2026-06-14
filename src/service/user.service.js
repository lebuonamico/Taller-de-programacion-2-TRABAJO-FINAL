import UserModel from '../model/User.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/jwt.js'

class UserService {
    async createUser(user) {
        const { name, email, password } = user

        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            throw new Error('Email already exists')
        }

        const hashed = await bcrypt.hash(password, 10)

        const created = await UserModel.create({ name, email, password: hashed })

        return {
            name: created.name,
            email: created.email
        }
    }

    async loginUser(email, password) {
        const user = await UserModel.findOne({ email })
        if (!user) {
            throw new Error('Invalid credentials')
        }

        const validPassword = await bcrypt.compare(password, user.password)
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
        const user = await UserModel.findById(id).lean()
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
        const user = await UserModel.findById(id)
        if (!user) {
            throw new Error('User not found')
        }

        if (data.name) {
            user.name = data.name
        }

        if (data.password) {
            user.password = await bcrypt.hash(data.password, 10)
        }

        const updatedUser = await user.save()

        return {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        }
    }

    async deleteProfile(id) {
        const user = await UserModel.findById(id)
        if (!user) {
            throw new Error('User not found')
        }

        await UserModel.deleteOne({ _id: id })
    }
}

export default UserService