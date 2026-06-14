import ServicioPresupuesto from '../servicio/presupuesto.service.js'

const servicio = new ServicioPresupuesto()

export const crearPresupuesto = async (req, res, next) => {
    try {
        const presupuesto = await servicio.crearPresupuesto(req.body, req.user.id)
        res.status(201).json(presupuesto)
    } catch (error) {
        next(error)
    }
}

export const obtenerPresupuestos = async (req, res, next) => {
    try {
        const presupuestos = await servicio.obtenerPresupuestos(req.user.id, req.query)
        res.json(presupuestos)
    } catch (error) {
        next(error)
    }
}

export const actualizarPresupuesto = async (req, res, next) => {
    try {
        const presupuesto = await servicio.actualizarPresupuesto(req.params.id, req.body, req.user.id)
        res.json(presupuesto)
    } catch (error) {
        next(error)
    }
}

export const eliminarPresupuesto = async (req, res, next) => {
    try {
        await servicio.eliminarPresupuesto(req.params.id, req.user.id)
        res.json({ mensaje: 'Presupuesto eliminado correctamente' })
    } catch (error) {
        next(error)
    }
}
