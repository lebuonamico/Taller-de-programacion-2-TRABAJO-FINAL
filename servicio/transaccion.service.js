import Transaccion from '../modelo/Transaccion.js'
import ModelFactory from '../modelo/DAO/modelFactory.js'
import config from '../config.js'

class TransaccionService {
    #modelo = null

    constructor() {
        const modo = config.MODO_PERSISTENCIA
        this.#modelo = ModelFactory.getTransacciones(modo)
    }

    crearTransaccion = async (datos, userId) => {
        const transaccion = new Transaccion({ ...datos, userId })

        transaccion.validate()

        await this.#modelo.crear(transaccion.toPersistence())

        return transaccion.toJSON()
    }

    obtenerTransacciones = async (userId, filtros) => {
        return await this.#modelo.obtenerTodas(userId, filtros)
    }

    obtenerTransaccion = async (id, userId) => {
        const transaccion = await this.#modelo.obtenerPorId(id)

        if (!transaccion) {
            throw new Error('Transacción no encontrada')
        }

        if (transaccion.userId !== userId) {
            throw new Error('No tenés permiso para ver esta transacción')
        }

        return transaccion
    }

    actualizarTransaccion = async (id, datos, userId) => {
        const transaccion = await this.#modelo.obtenerPorId(id)

        if (!transaccion) {
            throw new Error('Transacción no encontrada')
        }

        if (transaccion.userId !== userId) {
            throw new Error('No tenés permiso para modificar esta transacción')
        }

        const camposPermitidos = {}
        if (datos.monto !== undefined) camposPermitidos.monto = datos.monto
        if (datos.descripcion !== undefined) camposPermitidos.descripcion = datos.descripcion
        if (datos.idCategoria !== undefined) camposPermitidos.idCategoria = datos.idCategoria
        if (datos.fecha !== undefined) camposPermitidos.fecha = datos.fecha

        await this.#modelo.actualizar(id, camposPermitidos)

        return { ...transaccion, ...camposPermitidos }
    }

    eliminarTransaccion = async (id, userId) => {
        const transaccion = await this.#modelo.obtenerPorId(id)

        if (!transaccion) {
            throw new Error('Transacción no encontrada')
        }

        if (transaccion.userId !== userId) {
            throw new Error('No tenés permiso para eliminar esta transacción')
        }

        await this.#modelo.eliminar(id)
    }
}

export default TransaccionService
