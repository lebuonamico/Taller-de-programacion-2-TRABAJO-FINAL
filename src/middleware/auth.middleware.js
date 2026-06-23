import { verifyToken } from '../utils/jwt.js'
import createHttpError from '../utils/http-error.js'

const authMiddleware = (req, res, next) => {
    let decoded

    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return next(createHttpError('Token requerido', 401))
        }

        const match = authHeader.match(/^Bearer\s+(\S+)$/i)
        if (!match) {
            return next(createHttpError('Formato de autorización inválido', 401))
        }

        const token = match[1]
        decoded = verifyToken(token)

        if (!decoded?.id || !/^[a-fA-F0-9]{24}$/.test(String(decoded.id))) {
            return next(createHttpError('Token inválido o vencido', 401))
        }
    } catch (error) {
        return next(createHttpError('Token inválido o vencido', 401))
    }

    req.user = decoded
    next()
}

export default authMiddleware
