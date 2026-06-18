import createHttpError from '../utils/http-error.js'

const notFoundMiddleware = (req, res, next) => {
    next(createHttpError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404))
}

export default notFoundMiddleware
