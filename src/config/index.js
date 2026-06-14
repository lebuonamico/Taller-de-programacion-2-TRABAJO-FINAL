import dotenv from 'dotenv'

dotenv.config({ quiet: true })

export default {
    PORT: process.env.PORT || 8080,
    STRCNX: process.env.STRCNX ,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development',
}
