import dotenv from 'dotenv'

dotenv.config({quiet: true})

const PORT = process.env.PORT || 8080
const MODO_PERSISTENCIA = process.env.MODO_PERSISTENCIA || ''
const STRCNX = process.env.STRCNX || 'mongodb://localhost:27017'
const BASE = process.env.BASE || 'test'
const JWT_SECRET = process.env.JWT_SECRET || ''

export default {
    PORT,   // es igual a -> PORT: PORT
    MODO_PERSISTENCIA,
    STRCNX,
    BASE,
    JWT_SECRET
}