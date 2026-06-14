import express from 'express'
import rutasUsuario from './router/user.routes.js'
import rutasCategoria from './router/categoria.routes.js'
import rutasTransaccion from './router/transaccion.routes.js'
import rutasPresupuesto from './router/presupuesto.routes.js'
import rutasEstadisticas from './router/stats.routes.js'
import errorMiddleware from './middleware/error.middleware.js'

const createServer = () => {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static('public'))

    app.use('/api/users', rutasUsuario)
    app.use('/api/categories', rutasCategoria)
    app.use('/api/transactions', rutasTransaccion)
    app.use('/api/budgets', rutasPresupuesto)
    app.use('/api/stats', rutasEstadisticas)

    app.use(errorMiddleware)

    return app
}

export default createServer


