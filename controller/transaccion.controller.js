import TransaccionService from '../servicio/transaccion.service.js'

class TransaccionController {
    #servicio = null

    constructor() {
        this.#servicio = new TransaccionService()
    }

    crearTransaccion = async (req, res) => {
        try {
            const datos = req.body
            const userId = req.user.id

            const transaccion = await this.#servicio.crearTransaccion(datos, userId)

            res.status(201).json(transaccion)
        }
        catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    obtenerTransacciones = async (req, res) => {
        try {
            const userId = req.user.id
            const filtros = req.query

            const transacciones = await this.#servicio.obtenerTransacciones(userId, filtros)

            res.json(transacciones)
        }
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    obtenerTransaccion = async (req, res) => {
        try {
            const { id } = req.params
            const userId = req.user.id

            const transaccion = await this.#servicio.obtenerTransaccion(id, userId)

            res.json(transaccion)
        }
        catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    actualizarTransaccion = async (req, res) => {
        try {
            const { id } = req.params
            const datos = req.body
            const userId = req.user.id

            const transaccion = await this.#servicio.actualizarTransaccion(id, datos, userId)

            res.json(transaccion)
        }
        catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    eliminarTransaccion = async (req, res) => {
        try {
            const { id } = req.params
            const userId = req.user.id

            await this.#servicio.eliminarTransaccion(id, userId)

            res.json({ mensaje: 'Transacción eliminada correctamente' })
        }
        catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
}

export default TransaccionController
