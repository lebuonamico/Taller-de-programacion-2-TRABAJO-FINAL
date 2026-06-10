import Presupuesto from '../modelo/Presupuesto.js'
import ModelFactory from '../modelo/DAO/modelFactory.js'
import config from '../config.js'

class PresupuestoService {
    #modelo = null

    constructor() {
        const modo = config.MODO_PERSISTENCIA
        this.#modelo = ModelFactory.getPresupuestos(modo)
    }

    crearPresupuesto = async (datos, userId) => {
        const presupuesto = new Presupuesto({ ...datos, userId })

        presupuesto.validate()

        await this.#modelo.crear(presupuesto.toPersistence())

        return presupuesto.toJSON()
    }

    obtenerPresupuestos = async (userId, filtros) => {
        return await this.#modelo.obtenerTodas(userId, filtros)
    }

    actualizarPresupuesto = async (id, datos, userId) => {
        const presupuesto = await this.#modelo.obtenerPorId(id)

        if (!presupuesto) {
            throw new Error('Presupuesto no encontrado')
        }

        if (presupuesto.userId !== userId) {
            throw new Error('No tenés permiso para modificar este presupuesto')
        }

        const camposPermitidos = {}
        if (datos.limite !== undefined) camposPermitidos.limite = datos.limite
        if (datos.idCategoria !== undefined) camposPermitidos.idCategoria = datos.idCategoria
        if (datos.mes !== undefined) camposPermitidos.mes = datos.mes
        if (datos.anio !== undefined) camposPermitidos.anio = datos.anio

        await this.#modelo.actualizar(id, camposPermitidos)

        return { ...presupuesto, ...camposPermitidos }
    }

    eliminarPresupuesto = async (id, userId) => {
        const presupuesto = await this.#modelo.obtenerPorId(id)

        if (!presupuesto) {
            throw new Error('Presupuesto no encontrado')
        }

        if (presupuesto.userId !== userId) {
            throw new Error('No tenés permiso para eliminar este presupuesto')
        }

        await this.#modelo.eliminar(id)
    }
}

export default PresupuestoService
