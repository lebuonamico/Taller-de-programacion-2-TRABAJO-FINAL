import config from '../config/index.js'

const errorMiddleware = (err, req, res, next) => {
    if (res.headersSent) return next(err)

    let status = err.status || 500
    let message = err.message || 'Internal Server Error'
    let details = err.details

    if (err.name === 'CastError') {
        status = 400
        message = `El valor de ${err.path} no es válido`
    }

    if (err.name === 'ValidationError') {
        status = 400
        message = 'Error de validación'
        details = Object.values(err.errors).map(error => error.message)
    }

    if (err.code === 11000) {
        status = 409
        message = 'Ya existe un registro con esos datos'
        details = Object.keys(err.keyPattern ?? err.keyValue ?? {})
            .map(field => `El campo "${field}" no puede repetirse`)
    }

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        status = 400
        message = 'El cuerpo JSON no es válido'
    }

    const publicMessage = config.NODE_ENV === 'production' && status >= 500
        ? 'Internal Server Error'
        : message

    if (status >= 500) {
        console.error(err)
    }

    res.status(status).json({
        error: publicMessage,
        ...(details?.length && { detalles: details })
    })
}

export default errorMiddleware
