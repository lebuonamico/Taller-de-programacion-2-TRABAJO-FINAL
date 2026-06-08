import { ObjectId } from 'mongodb'
import CnxMongoDB from '../MongoDB.js'

class TransaccionesMongoDB {

    async crear(transaccion) {
        if (!CnxMongoDB.connectionOK) {
            throw new Error('Error de conexión con la base de datos')
        }

        await CnxMongoDB.db
            .collection('transacciones')
            .insertOne(transaccion)

        return transaccion
    }

    async obtenerTodas(userId, filtros = {}) {
        if (!CnxMongoDB.connectionOK) {
            throw new Error('Error de conexión con la base de datos')
        }

        const query = { userId }

        if (filtros.tipo) query.tipo = filtros.tipo
        if (filtros.idCategoria) query.idCategoria = filtros.idCategoria
        if (filtros.mes) {
            query.fecha = {
                $regex: `-${String(filtros.mes).padStart(2, '0')}-`
            }
        }

        const orden = filtros.orden === 'asc' ? 1 : -1

        return await CnxMongoDB.db
            .collection('transacciones')
            .find(query)
            .sort({ fecha: orden })
            .toArray()
    }

    async obtenerPorId(id) {
        if (!CnxMongoDB.connectionOK) {
            throw new Error('Error de conexión con la base de datos')
        }

        return await CnxMongoDB.db
            .collection('transacciones')
            .findOne({ _id: new ObjectId(id) })
    }

    async actualizar(id, datos) {
        if (!CnxMongoDB.connectionOK) {
            throw new Error('Error de conexión con la base de datos')
        }

        await CnxMongoDB.db
            .collection('transacciones')
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
            .collection('transacciones')
            .deleteOne({ _id: new ObjectId(id) })
    }
}

export default TransaccionesMongoDB
