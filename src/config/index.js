import dotenv from 'dotenv'

dotenv.config({ quiet: true })

export default {
    PORT: process.env.PORT || 8080,
    STRCNX: process.env.STRCNX,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MAIL_HOST: process.env.MAIL_HOST || '',
    MAIL_PORT: parseInt(process.env.MAIL_PORT, 10) || 587,
    MAIL_USER: process.env.MAIL_USER || '',
    MAIL_PASS: process.env.MAIL_PASS || '',
    MAIL_FROM: process.env.MAIL_FROM || 'Finanzas Personales <no-reply@finanzas.com>',
    MAIL_ETHEREAL: process.env.MAIL_ETHEREAL === 'true'
}
