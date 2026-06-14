import ServicioEstadisticas from '../service/stats.service.js'

const servicio = new ServicioEstadisticas()

export const obtenerEstadisticasMensuales = async (req, res, next) => {
    try {
        const mes = req.query.mes ?? new Date().getMonth() + 1
        const anio = req.query.anio ?? new Date().getFullYear()
        const estadisticas = await servicio.obtenerEstadisticasMensuales(req.user.id, mes, anio)
        res.json(estadisticas)
    } catch (error) {
        next(error)
    }
}

export const obtenerEstadisticasPorCategoria = async (req, res, next) => {
    try {
        const { mes, anio } = req.query
        const estadisticas = await servicio.obtenerEstadisticasPorCategoria(req.user.id, mes, anio)
        res.json(estadisticas)
    } catch (error) {
        next(error)
    }
}

export const obtenerTendencias = async (req, res, next) => {
    try {
        const meses = req.query.meses ?? 6
        const estadisticas = await servicio.obtenerTendencias(req.user.id, meses)
        res.json(estadisticas)
    } catch (error) {
        next(error)
    }
}
