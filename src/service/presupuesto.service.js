import Presupuesto from '../model/Presupuesto.js'

class ServicioPresupuesto {

    async crearPresupuesto(datos, idUsuario) {
        const presupuesto = await Presupuesto.create({
            categoria: datos.categoria,
            limite: datos.limite,
            mes: datos.mes,
            anio: datos.anio,
            user: idUsuario
        })
        return presupuesto.toObject()
    }

    async obtenerPresupuestos(idUsuario, filtros = {}) {
        const consulta = { user: idUsuario }

        if (filtros.categoria) consulta.categoria = filtros.categoria
        if (filtros.mes) consulta.mes = parseInt(filtros.mes, 10)
        if (filtros.anio) consulta.anio = parseInt(filtros.anio, 10)

        return await Presupuesto.find(consulta)
            .populate('categoria', 'name')
            .lean()
    }

    async actualizarPresupuesto(id, datos, idUsuario) {
        const presupuesto = await Presupuesto.findOne({ _id: id, user: idUsuario })
        if (!presupuesto) throw new Error('Presupuesto no encontrado')

        if (datos.limite !== undefined) presupuesto.limite = datos.limite
        if (datos.categoria !== undefined) presupuesto.categoria = datos.categoria
        if (datos.mes !== undefined) presupuesto.mes = datos.mes
        if (datos.anio !== undefined) presupuesto.anio = datos.anio

        await presupuesto.save()
        return presupuesto.toObject()
    }

    async eliminarPresupuesto(id, idUsuario) {
        const presupuesto = await Presupuesto.findOneAndDelete({ _id: id, user: idUsuario })
        if (!presupuesto) throw new Error('Presupuesto no encontrado')
    }
}

export default ServicioPresupuesto
