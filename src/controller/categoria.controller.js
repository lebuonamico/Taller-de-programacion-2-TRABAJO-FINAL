import ServicioCategoria from '../service/categoria.service.js'

const servicio = new ServicioCategoria()

export const obtenerCategorias = async (req, res, next) => {
    try {
        const categorias = await servicio.obtenerCategorias(req.user.id)
        res.json(categorias)
    } catch (error) {
        next(error)
    }
}

export const crearCategoria = async (req, res, next) => {
    try {
        const categoria = await servicio.crearCategoria(req.user.id, req.body)
        res.status(201).json(categoria)
    } catch (error) {
        next(error)
    }
}

export const actualizarCategoria = async (req, res, next) => {
    try {
        const categoria = await servicio.actualizarCategoria(req.user.id, req.params.id, req.body)
        res.json(categoria)
    } catch (error) {
        next(error)
    }
}

export const eliminarCategoria = async (req, res, next) => {
    try {
        const resultado = await servicio.eliminarCategoria(req.user.id, req.params.id)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

