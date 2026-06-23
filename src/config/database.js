import mongoose from 'mongoose'
import config from './index.js'

const connectDB = async () => {
    try {
        await mongoose.connect(config.STRCNX)
    } catch (error) {
        console.error(`Error en conexión de base de datos: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB
