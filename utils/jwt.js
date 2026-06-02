import jwt from 'jsonwebtoken'
import config from '../config.js'

export const generateToken = payload => {

    return jwt.sign(
        payload,
        config.JWT_SECRET,
        {
            expiresIn: '24h'
        }
    )
}

export const verifyToken = token => {

    return jwt.verify(
        token,
        config.JWT_SECRET
    )
}