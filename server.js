import express from 'express'
import UserRouter from './router/user.routes.js'


class Server {
    #port = null
    #userRouter = null

    constructor(port) {
        this.#port = port
        this.#userRouter = new UserRouter().config()
    }

    start() {
        const app = express()

        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))

        //Servicio de recursos estáticos (recursos de Frontend)
        app.use(express.static('public'))

        app.use('/api/users', this.#userRouter)

        const port = this.#port
        const server = app.listen(port, () => console.log(`Servidor ApiRestful escuchando en http://localhost:${port}`))
        server.on('error', error => console.log(`Error en servidor ${error.message}`))
    }
}

export default Server

