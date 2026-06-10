import PresupuestoService from '../servicio/presupuesto.service.js'

class PresupuestoController {
    #servicio = null

    constructor() {
        this.#servicio = new PresupuestoService()
    }

    crearPresupuesto = async (req, res) => {
        try {
            const datos = req.body
            const userId = req.user.id

            const presupuesto = await this.#servicio.crearPresupuesto(datos, userId)

            res.status(201).json(presupuesto)
        }
        catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    obtenerPresupuestos = async (req, res) => {
        try {
            const userId = req.user.id
            const filtros = req.query

            const presupuestos = await this.#servicio.obtenerPresupuestos(userId, filtros)

            res.json(presupuestos)
        }
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    actualizarPresupuesto = async (req, res) => {
        try {
            const { id } = req.params
            const datos = req.body
            const userId = req.user.id

            const presupuesto = await this.#servicio.actualizarPresupuesto(id, datos, userId)

            res.json(presupuesto)
        }
        catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    eliminarPresupuesto = async (req, res) => {
        try {
            const { id } = req.params
            const userId = req.user.id

            await this.#servicio.eliminarPresupuesto(id, userId)

            res.json({ mensaje: 'Presupuesto eliminado correctamente' })
        }
        catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
}

export default PresupuestoController
