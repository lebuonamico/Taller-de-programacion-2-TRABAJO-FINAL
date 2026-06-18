import mongoose from 'mongoose'
import Transaccion from '../model/Transaccion.js'
import createHttpError from '../utils/http-error.js'

class ServicioEstadisticas {

    // GET /stats/monthly?mes=6&anio=2026
    // Agrupa ingresos y gastos del mes pedido, calcula balance y % de ahorro
    async obtenerEstadisticasMensuales(idUsuario, mes, anio) {
        const mesNum = parseInt(mes, 10)
        const anioNum = parseInt(anio, 10)

        if (!Number.isInteger(mesNum) || mesNum < 1 || mesNum > 12) {
            throw createHttpError('El mes debe estar entre 1 y 12', 400)
        }

        if (!Number.isInteger(anioNum) || anioNum < 2000) {
            throw createHttpError('El año debe ser válido', 400)
        }

        const desde = new Date(anioNum, mesNum - 1, 1)
        const hasta = new Date(anioNum, mesNum, 1)

        // Pipeline:
        // 1. $match  — filtra por usuario y rango de fechas
        // 2. $group  — agrupa por tipo (ingreso/gasto) y suma los montos
        // 3. $group  — segundo group para pivotear los dos tipos en un solo doc
        const resultado = await Transaccion.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(idUsuario),
                    fecha: { $gte: desde, $lt: hasta }
                }
            },
            {
                $group: {
                    _id: '$tipo',
                    total: { $sum: '$monto' },
                    cantidad: { $sum: 1 },
                    promedio: { $avg: '$monto' }
                }
            },
            {
                $group: {
                    _id: null,
                    datos: {
                        $push: {
                            tipo: '$_id',
                            total: '$total',
                            cantidad: '$cantidad',
                            promedio: '$promedio'
                        }
                    }
                }
            }
        ])

        const datos = resultado[0]?.datos ?? []
        const ingresos = datos.find(d => d.tipo === 'ingreso')?.total ?? 0
        const gastos = datos.find(d => d.tipo === 'gasto')?.total ?? 0
        const cantIngresos = datos.find(d => d.tipo === 'ingreso')?.cantidad ?? 0
        const cantGastos = datos.find(d => d.tipo === 'gasto')?.cantidad ?? 0

        const balance = ingresos - gastos
        const porcentajeAhorro = ingresos > 0
            ? parseFloat(((balance / ingresos) * 100).toFixed(2))
            : 0

        return {
            periodo: { mes: mesNum, anio: anioNum },
            ingresos,
            gastos,
            balance,
            porcentajeAhorro,
            cantidadTransacciones: {
                ingresos: cantIngresos,
                gastos: cantGastos,
                total: cantIngresos + cantGastos
            }
        }
    }

    // GET /stats/categories?mes=6&anio=2026
    // Agrupa los GASTOS por categoría y los ordena de mayor a menor
    async obtenerEstadisticasPorCategoria(idUsuario, mes, anio) {
        const filtro = { user: new mongoose.Types.ObjectId(idUsuario), tipo: 'gasto' }

        if (mes && anio) {
            const mesNum = parseInt(mes, 10)
            const anioNum = parseInt(anio, 10)

            if (!Number.isInteger(mesNum) || mesNum < 1 || mesNum > 12) {
                throw createHttpError('El mes debe estar entre 1 y 12', 400)
            }

            if (!Number.isInteger(anioNum) || anioNum < 2000) {
                throw createHttpError('El año debe ser válido', 400)
            }

            filtro.fecha = {
                $gte: new Date(anioNum, mesNum - 1, 1),
                $lt: new Date(anioNum, mesNum, 1)
            }
        }

        // Pipeline:
        // 1. $match     — solo gastos del usuario (y período opcional)
        // 2. $group     — agrupa por categoria, suma montos y cuenta transacciones
        // 3. $lookup    — hace JOIN con la colección categories para traer el nombre
        // 4. $unwind    — desanida el array que genera $lookup
        // 5. $project   — da forma al output
        // 6. $sort      — ordena de mayor gasto a menor
        const resultado = await Transaccion.aggregate([
            { $match: filtro },
            {
                $group: {
                    _id: '$categoria',
                    total: { $sum: '$monto' },
                    cantidad: { $sum: 1 },
                    promedio: { $avg: '$monto' }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'infoCategoria'
                }
            },
            { $unwind: '$infoCategoria' },
            {
                $project: {
                    _id: 0,
                    categoriaId: '$_id',
                    nombre: '$infoCategoria.name',
                    total: 1,
                    cantidad: 1,
                    promedio: { $round: ['$promedio', 2] }
                }
            },
            { $sort: { total: -1 } }
        ])

        const totalGastos = resultado.reduce((acc, cat) => acc + cat.total, 0)

        const categorias = resultado.map(cat => ({
            ...cat,
            porcentaje: totalGastos > 0
                ? parseFloat(((cat.total / totalGastos) * 100).toFixed(2))
                : 0
        }))

        return {
            totalGastos,
            categoriaConMayorGasto: categorias[0] ?? null,
            categorias
        }
    }

    // GET /stats/trends?meses=6
    // Compara los últimos N meses: calcula evolución de ingresos y gastos mes a mes
    async obtenerTendencias(idUsuario, meses = 6) {
        const cantMeses = Math.min(parseInt(meses, 10) || 6, 24)

        if (cantMeses < 1) {
            throw createHttpError('La cantidad de meses debe ser mayor a 0', 400)
        }

        const desde = new Date()
        desde.setMonth(desde.getMonth() - cantMeses)
        desde.setDate(1)
        desde.setHours(0, 0, 0, 0)

        // Pipeline:
        // 1. $match      — usuario + rango de fechas
        // 2. $group      — agrupa por año+mes y tipo, suma montos
        // 3. $group      — pivotea los tipos en un solo documento por mes
        // 4. $project    — calcula balance y da formato al período
        // 5. $sort       — ordena cronológicamente
        const resultado = await Transaccion.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(idUsuario),
                    fecha: { $gte: desde }
                }
            },
            {
                $group: {
                    _id: {
                        anio: { $year: '$fecha' },
                        mes: { $month: '$fecha' },
                        tipo: '$tipo'
                    },
                    total: { $sum: '$monto' }
                }
            },
            {
                $group: {
                    _id: { anio: '$_id.anio', mes: '$_id.mes' },
                    datos: {
                        $push: { tipo: '$_id.tipo', total: '$total' }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    anio: '$_id.anio',
                    mes: '$_id.mes',
                    ingresos: {
                        $ifNull: [
                            { $first: { $filter: { input: '$datos', cond: { $eq: ['$$this.tipo', 'ingreso'] } } } },
                            { tipo: 'ingreso', total: 0 }
                        ]
                    },
                    gastos: {
                        $ifNull: [
                            { $first: { $filter: { input: '$datos', cond: { $eq: ['$$this.tipo', 'gasto'] } } } },
                            { tipo: 'gasto', total: 0 }
                        ]
                    }
                }
            },
            { $sort: { anio: 1, mes: 1 } }
        ])

        const datosPorMes = resultado.map(r => ({
            periodo: `${r.anio}-${String(r.mes).padStart(2, '0')}`,
            anio: r.anio,
            mes: r.mes,
            ingresos: r.ingresos?.total ?? 0,
            gastos: r.gastos?.total ?? 0,
            balance: (r.ingresos?.total ?? 0) - (r.gastos?.total ?? 0)
        }))

        const tendencias = datosPorMes.map((item, i) => {
            if (i === 0) return { ...item, variacionGastos: null, variacionIngresos: null }

            const anterior = datosPorMes[i - 1]
            const variacionGastos = anterior.gastos > 0
                ? parseFloat((((item.gastos - anterior.gastos) / anterior.gastos) * 100).toFixed(2))
                : null
            const variacionIngresos = anterior.ingresos > 0
                ? parseFloat((((item.ingresos - anterior.ingresos) / anterior.ingresos) * 100).toFixed(2))
                : null

            return { ...item, variacionGastos, variacionIngresos }
        })

        const ultimo = tendencias.at(-1)
        const tendenciaGeneral = ultimo?.variacionGastos == null
            ? 'sin datos suficientes'
            : ultimo.variacionGastos > 5
                ? 'gastos en aumento'
                : ultimo.variacionGastos < -5
                    ? 'gastos en disminución'
                    : 'gastos estables'

        return {
            periodoAnalizado: `últimos ${cantMeses} meses`,
            tendenciaGeneral,
            meses: tendencias
        }
    }
}

export default ServicioEstadisticas
