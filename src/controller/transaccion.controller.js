import ServicioTransaccion from '../servicio/transaccion.service.js'

const servicio = new ServicioTransaccion()

export const crearTransaccion = async (req, res, next) => {
    try {
        const transaccion = await servicio.crearTransaccion(req.body, req.user.id)
        res.status(201).json(transaccion)
    } catch (error) {
        next(error)
    }
}

export const obtenerTransacciones = async (req, res, next) => {
    try {
        const transacciones = await servicio.obtenerTransacciones(req.user.id, req.query)
        res.json(transacciones)
    } catch (error) {
        next(error)
    }
}

export const obtenerTransaccion = async (req, res, next) => {
    try {
        const transaccion = await servicio.obtenerTransaccion(req.params.id, req.user.id)
        res.json(transaccion)
    } catch (error) {
        next(error)
    }
}

export const actualizarTransaccion = async (req, res, next) => {
    try {
        const transaccion = await servicio.actualizarTransaccion(req.params.id, req.body, req.user.id)
        res.json(transaccion)
    } catch (error) {
        next(error)
    }
}

export const eliminarTransaccion = async (req, res, next) => {
    try {
        await servicio.eliminarTransaccion(req.params.id, req.user.id)
        res.json({ mensaje: 'Transacción eliminada correctamente' })
    } catch (error) {
        next(error)
    }
}
