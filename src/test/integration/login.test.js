import request from 'supertest'
import { expect } from 'chai'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import createServer from '../../server.js'

const app = createServer()

const BASE = '/api/users'
const usuario = { name: 'Ana García', email: 'ana@test.com', password: 'password123' }

let mongoServer

before(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
})

beforeEach(async () => {
    await mongoose.connection.dropDatabase()
    await request(app).post(`${BASE}/register`).send(usuario)
})

after(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})

describe('POST /api/users/login', () => {
    it('200 - devuelve un token JWT con credenciales válidas', async () => {
        const res = await request(app)
            .post(`${BASE}/login`)
            .send({ email: usuario.email, password: usuario.password })

        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('token')
        expect(res.body.token).to.be.a('string')
        expect(res.body.token.split('.')).to.have.lengthOf(3)
    })

    it('401 - falla con la contraseña incorrecta', async () => {
        const res = await request(app)
            .post(`${BASE}/login`)
            .send({ email: usuario.email, password: 'contraseñaMala' })

        expect(res.status).to.equal(401)
        expect(res.body.error).to.equal('Credenciales inválidas')
    })

    it('401 - falla cuando el email no está registrado', async () => {
        const res = await request(app)
            .post(`${BASE}/login`)
            .send({ email: 'noexiste@test.com', password: 'password123' })

        expect(res.status).to.equal(401)
        expect(res.body.error).to.equal('Credenciales inválidas')
    })

    it('400 - falla la validación cuando falta la contraseña', async () => {
        const res = await request(app)
            .post(`${BASE}/login`)
            .send({ email: usuario.email })

        expect(res.status).to.equal(400)
    })
})
