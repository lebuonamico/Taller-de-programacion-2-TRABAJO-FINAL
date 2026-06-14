import bcrypt from 'bcrypt'
import User from '../modelo/User.js'
import { generateToken } from '../utils/jwt.js'

class UserService {

    async createUser(data) {
        const exists = await User.findOne({ email: data.email.toLowerCase() })
        if (exists) throw new Error('Email already exists')

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = await User.create({
            name: data.name,
            email: data.email,
            password: hashedPassword
        })

        return user.toJSON()
    }

    async loginUser(email, password) {
        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) throw new Error('Invalid credentials')

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) throw new Error('Invalid credentials')

        const token = generateToken({ id: user._id, email: user.email })
        return { token }
    }

    async getProfile(id) {
        const user = await User.findById(id)
        if (!user) throw new Error('User not found')
        return user.toJSON()
    }
}

export default UserService

