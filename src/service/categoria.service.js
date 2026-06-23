import Categoria from '../model/Categoria.js'
import createHttpError from '../utils/http-error.js'

class ServicioCategoria {

    async obtenerCategorias(idUsuario) {
        return await Categoria.find({ user: idUsuario }).lean()
    }

    async crearCategoria(idUsuario, datos) {
        const categoria = await Categoria.create({
            name: datos.name,
            description: datos.description,
            user: idUsuario
        })
        return categoria.toObject()
    }

    async actualizarCategoria(idUsuario, id, datos) {
        const categoria = await Categoria.findOne({ _id: id, user: idUsuario })
        if (!categoria) throw createHttpError('Categoría no encontrada', 404)

        categoria.name = datos.name ?? categoria.name
        categoria.description = datos.description ?? categoria.description
        await categoria.save()

        return categoria.toObject()
    }

    async eliminarCategoria(idUsuario, id) {
        const categoria = await Categoria.findOneAndDelete({ _id: id, user: idUsuario })
        if (!categoria) throw createHttpError('Categoría no encontrada', 404)
        return { mensaje: 'Categoría eliminada correctamente' }
    }
}

export default ServicioCategoria
