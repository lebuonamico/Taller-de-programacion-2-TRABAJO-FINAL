import config from '../config/index.js'

const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500

    const message = config.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message

    res.status(status).json({ error: message })
}

export default errorMiddleware
