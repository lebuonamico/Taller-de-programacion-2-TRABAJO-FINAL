import { ObjectId } from 'mongodb'
import CnxMongoDB from '../MongoDB.js'

class PresupuestosMongoDB {

    async crear(presupuesto) {
        if (!CnxMongoDB.connectionOK) {
            throw new Error('Error de conexión con la base de datos')
        }

        await CnxMongoDB.db
            .collection('presupuestos')
            .insertOne(presupuesto)

        return presupuesto
    }

    async obtenerTodas(userId, filtros = {}) {
        if (!CnxMongoDB.connectionOK) {
            throw new Error('Error de conexión con la base de datos')
        }

        const query = { userId }

        if (filtros.idCategoria) query.idCategoria = filtros.idCategoria
        if (filtros.mes) query.mes = Number(filtros.mes)
        if (filtros.anio) query.anio = Number(filtros.anio)

        return await CnxMongoDB.db
            .collection('presupuestos')
            .find(query)
            .toArray()
    }

    async obtenerPorId(id) {
        if (!CnxMongoDB.connectionOK) {
            throw new Error('Error de conexión con la base de datos')
        }

        return await CnxMongoDB.db
            .collection('presupuestos')
            .findOne({ _id: new ObjectId(id) })
    }

    async actualizar(id, datos) {
        if (!CnxMongoDB.connectionOK) {
            throw new Error('Error de conexión con la base de datos')
        }

        await CnxMongoDB.db
            .collection('presupuestos')
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: datos }
            )
    }

    async eliminar(id) {
        if (!CnxMongoDB.connectionOK) {
            throw new Error('Error de conexión con la base de datos')
        }

        await CnxMongoDB.db
            .collection('presupuestos')
            .deleteOne({ _id: new ObjectId(id) })
    }
}

export default PresupuestosMongoDB
