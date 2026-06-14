import { verifyToken } from '../utils/jwt.js'

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({ error: 'Token required' })
        }

        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' })
    }
}

export default authMiddleware
