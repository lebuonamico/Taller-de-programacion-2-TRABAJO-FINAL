import nodemailer from 'nodemailer'
import config from '../config/index.js'

let transporterPromise = null

const crearTransporter = async () => {
    if (config.MAIL_HOST && config.MAIL_USER) {
        return nodemailer.createTransport({
            host: config.MAIL_HOST,
            port: config.MAIL_PORT,
            secure: config.MAIL_PORT === 465,
            auth: {
                user: config.MAIL_USER,
                pass: config.MAIL_PASS
            }
        })
    }

    if (config.MAIL_ETHEREAL) {
        const cuenta = await nodemailer.createTestAccount()
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: cuenta.user,
                pass: cuenta.pass
            }
        })
    }

    return nodemailer.createTransport({ jsonTransport: true })
}

const obtenerTransporter = () => {
    if (!transporterPromise) transporterPromise = crearTransporter()
    return transporterPromise
}

export const enviarMail = async ({ para, asunto, html }) => {
    const transporter = await obtenerTransporter()
    const info = await transporter.sendMail({
        from: config.MAIL_FROM,
        to: para,
        subject: asunto,
        html
    })

    return {
        messageId: info.messageId,
        previewURL: nodemailer.getTestMessageUrl(info) || null
    }
}

export default obtenerTransporter
