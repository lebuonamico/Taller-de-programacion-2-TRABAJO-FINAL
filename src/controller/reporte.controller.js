import ServicioReporte from '../service/reporte.service.js'

const servicio = new ServicioReporte()

export const enviarReporte = async (req, res, next) => {
    try {
        const resultado = await servicio.enviarReporte(req.user.id, req.user.email, req.body)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}
