import ServicioEstadisticas from './stats.service.js'
import { construirReporteHTML } from '../utils/reporteTemplate.js'
import { enviarMail } from '../utils/mailer.js'

class ServicioReporte {

    constructor() {
        this.estadisticas = new ServicioEstadisticas()
    }

    async enviarReporte(idUsuario, emailUsuario, { email, mes, anio } = {}) {
        const mesNum = parseInt(mes, 10) || (new Date().getMonth() + 1)
        const anioNum = parseInt(anio, 10) || new Date().getFullYear()

        const [mensuales, categorias, tendencias] = await Promise.all([
            this.estadisticas.obtenerEstadisticasMensuales(idUsuario, mesNum, anioNum),
            this.estadisticas.obtenerEstadisticasPorCategoria(idUsuario, mesNum, anioNum),
            this.estadisticas.obtenerTendencias(idUsuario, 6)
        ])

        const periodo = { mes: mesNum, anio: anioNum }
        const html = construirReporteHTML({ periodo, mensuales, categorias, tendencias })

        const destinatario = email || emailUsuario
        if (!destinatario) throw new Error('No se pudo determinar el destinatario del reporte')

        const info = await enviarMail({
            para: destinatario,
            asunto: `Reporte financiero ${mesNum}/${anioNum}`,
            html
        })

        return {
            mensaje: 'Reporte enviado correctamente',
            enviadoA: destinatario,
            periodo,
            messageId: info.messageId,
            ...(info.previewURL && { previewURL: info.previewURL })
        }
    }
}

export default ServicioReporte
