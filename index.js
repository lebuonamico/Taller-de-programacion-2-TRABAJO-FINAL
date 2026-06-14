import config from './src/config/index.js'
import connectDB from './src/config/database.js'
import createServer from './src/server.js'

await connectDB()

const app = createServer()
app.listen(config.PORT, () => {
    console.log(`Servidor ApiRestful escuchando en http://localhost:${config.PORT}`)
})
