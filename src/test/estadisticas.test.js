import { expect } from 'chai'
//usamos sinon para stubbear transaccion.aggregate y no requerir MongoDB
import sinon from 'sinon'  
import mongoose from 'mongoose'
import Transaccion from '../model/Transaccion.js'
import ServicioEstadisticas from '../service/stats.service.js'

describe('TEST DEL CASO COMPLEJO "ESTADISTICAS"', () => {
    let servicio
    let aggregateStub

    beforeEach(() => {
        servicio = new ServicioEstadisticas()
        aggregateStub = sinon.stub(Transaccion, 'aggregate')
    })

    afterEach(() => {
        sinon.restore()
    })

    describe('obtenerEstadisticasPorCategoria', () => {
        const userId = new mongoose.Types.ObjectId().toString()
        const catId1 = new mongoose.Types.ObjectId()
        const catId2 = new mongoose.Types.ObjectId()

        it('debe agrupar gastos por categoría y calcular porcentajes', async () => {
            aggregateStub.resolves([
                { total: 80000, cantidad: 4, categoriaId: catId1, nombre: 'Comida', promedio: 20000 },
                { total: 20000, cantidad: 2, categoriaId: catId2, nombre: 'Transporte', promedio: 10000 }
            ])

            const resultado = await servicio.obtenerEstadisticasPorCategoria(userId, 6, 2026)

            expect(resultado.totalGastos).to.equal(100000)
            expect(resultado.categorias).to.have.lengthOf(2)
            expect(resultado.categorias[0].porcentaje).to.equal(80)
            expect(resultado.categorias[1].porcentaje).to.equal(20)
        })

        it('debe identificar la categoría con mayor gasto', async () => {
            aggregateStub.resolves([
                { total: 50000, cantidad: 3, categoriaId: catId1, nombre: 'Comida', promedio: 16666.67 },
                { total: 30000, cantidad: 1, categoriaId: catId2, nombre: 'Transporte', promedio: 30000 }
            ])

            const resultado = await servicio.obtenerEstadisticasPorCategoria(userId, 6, 2026)

            expect(resultado.categoriaConMayorGasto).to.not.be.null
            expect(resultado.categoriaConMayorGasto.nombre).to.equal('Comida')
            expect(resultado.categoriaConMayorGasto.total).to.equal(50000)
        })

        it('debe devolver totalGastos 0 y categoriaConMayorGasto null si no hay gastos', async () => {
            aggregateStub.resolves([])

            const resultado = await servicio.obtenerEstadisticasPorCategoria(userId, 6, 2026)

            expect(resultado.totalGastos).to.equal(0)
            expect(resultado.categoriaConMayorGasto).to.be.null
            expect(resultado.categorias).to.be.an('array').that.is.empty
        })

        it('debe lanzar error si el mes es inválido', async () => {
            try {
                await servicio.obtenerEstadisticasPorCategoria(userId, 13, 2026)
                expect.fail('Debería haber lanzado un error')
            } catch (error) {
                expect(error.status).to.equal(400)
                expect(error.message).to.equal('El mes debe estar entre 1 y 12')
            }
        })

        it('debe lanzar error si el año es inválido', async () => {
            try {
                await servicio.obtenerEstadisticasPorCategoria(userId, 6, 1999)
                expect.fail('Debería haber lanzado un error')
            } catch (error) {
                expect(error.status).to.equal(400)
                expect(error.message).to.equal('El año debe ser válido')
            }
        })

        it('debe construir el filtro con fechas UTC correctas', async () => {
            aggregateStub.resolves([])

            await servicio.obtenerEstadisticasPorCategoria(userId, 6, 2026)

            const pipeline = aggregateStub.firstCall.args[0]
            const matchStage = pipeline[0].$match

            expect(matchStage.tipo).to.equal('gasto')
            expect(matchStage.fecha.$gte).to.deep.equal(new Date(Date.UTC(2026, 5, 1)))
            expect(matchStage.fecha.$lt).to.deep.equal(new Date(Date.UTC(2026, 6, 1)))
        })

        it('debe funcionar sin filtro de mes/anio', async () => {
            aggregateStub.resolves([
                { total: 40000, cantidad: 2, categoriaId: catId1, nombre: 'Comida', promedio: 20000 }
            ])

            const resultado = await servicio.obtenerEstadisticasPorCategoria(userId, undefined, undefined)

            expect(resultado.totalGastos).to.equal(40000)
            expect(resultado.categorias).to.have.lengthOf(1)

            const pipeline = aggregateStub.firstCall.args[0]
            const matchStage = pipeline[0].$match
            expect(matchStage.fecha).to.be.undefined
        })

        it('debe ordenar categorías de mayor a menor gasto', async () => {
            aggregateStub.resolves([
                { total: 60000, cantidad: 3, categoriaId: catId1, nombre: 'Comida', promedio: 20000 },
                { total: 25000, cantidad: 1, categoriaId: catId2, nombre: 'Transporte', promedio: 25000 }
            ])

            const resultado = await servicio.obtenerEstadisticasPorCategoria(userId, 6, 2026)

            expect(resultado.categorias[0].total).to.be.greaterThan(resultado.categorias[1].total)
        })
    })
})
