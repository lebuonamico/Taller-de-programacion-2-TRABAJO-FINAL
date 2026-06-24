import dotenv from 'dotenv'
import connectDB from './src/config/database.js'
import createServer from './src/server.js'
import config from './src/config/index.js'
import seedDemoData from './src/seed/demoData.js'

dotenv.config({ quiet: true })

try {
    await connectDB()
   // await seedDemoData()

    const app = createServer()
    const server = app.listen(config.PORT, () =>
        console.log(`Servidor ApiRestful escuchando en http://localhost:${config.PORT}`)
    )

    server.on('error', error => console.log(`Error en servidor ${error.message}`))
} catch (error) {
    console.error('Fallo al iniciar la aplicación:', error.message)
    process.exit(1)
}
