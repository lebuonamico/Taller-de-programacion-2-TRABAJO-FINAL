import Transaccion from '../model/Transaccion.js'
import Categoria from '../model/Categoria.js'
import createHttpError from '../utils/http-error.js'

class ServicioTransaccion {

    async validarCategoria(categoriaId, idUsuario) {
        const categoria = await Categoria.exists({ _id: categoriaId, user: idUsuario })
        if (!categoria) {
            throw createHttpError('Categoría no encontrada', 404)
        }
    }

    async crearTransaccion(datos, idUsuario) {
        await this.validarCategoria(datos.categoria, idUsuario)

        const transaccion = await Transaccion.create({
            tipo: datos.tipo,
            monto: datos.monto,
            descripcion: datos.descripcion,
            categoria: datos.categoria,
            fecha: datos.fecha,
            user: idUsuario
        })
        return transaccion.toObject()
    }

    async obtenerTransacciones(idUsuario, filtros = {}) {
        const consulta = { user: idUsuario }

        if (filtros.tipo) consulta.tipo = filtros.tipo
        if (filtros.categoria) consulta.categoria = filtros.categoria
        if (filtros.mes) {
            const mes = parseInt(filtros.mes, 10)
            const anio = filtros.anio ? parseInt(filtros.anio, 10) : new Date().getFullYear()
            consulta.fecha = {
                $gte: new Date(anio, mes - 1, 1),
                $lt: new Date(anio, mes, 1)
            }
        }

        const orden = filtros.orden === 'asc' ? 1 : -1

        return await Transaccion.find(consulta)
            .sort({ fecha: orden })
            .populate('categoria', 'name')
            .lean()
    }

    async obtenerTransaccion(id, idUsuario) {
        const transaccion = await Transaccion.findOne({ _id: id, user: idUsuario })
            .populate('categoria', 'name')
        if (!transaccion) throw createHttpError('Transacción no encontrada', 404)
        return transaccion.toObject()
    }

    async actualizarTransaccion(id, datos, idUsuario) {
        const transaccion = await Transaccion.findOne({ _id: id, user: idUsuario })
        if (!transaccion) throw createHttpError('Transacción no encontrada', 404)

        if (datos.categoria !== undefined) {
            await this.validarCategoria(datos.categoria, idUsuario)
        }

        if (datos.tipo !== undefined) transaccion.tipo = datos.tipo
        if (datos.monto !== undefined) transaccion.monto = datos.monto
        if (datos.descripcion !== undefined) transaccion.descripcion = datos.descripcion
        if (datos.categoria !== undefined) transaccion.categoria = datos.categoria
        if (datos.fecha !== undefined) transaccion.fecha = datos.fecha

        await transaccion.save()
        return transaccion.toObject()
    }

    async eliminarTransaccion(id, idUsuario) {
        const transaccion = await Transaccion.findOneAndDelete({ _id: id, user: idUsuario })
        if (!transaccion) throw createHttpError('Transacción no encontrada', 404)
    }
}

export default ServicioTransaccion
