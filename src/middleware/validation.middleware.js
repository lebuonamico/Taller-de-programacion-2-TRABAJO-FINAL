import Joi from 'joi'
import createHttpError from '../utils/http-error.js'

const schemas = {
    register: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    updateUser: Joi.object({
        name: Joi.string().min(2).max(50),
        email: Joi.string().email(),
        password: Joi.string().min(8)
    }).min(1),

    transaction: Joi.object({
        tipo: Joi.string().valid('ingreso', 'gasto').required(),
        monto: Joi.number().positive().required(),
        descripcion: Joi.string().allow('').optional(),
        categoria: Joi.string().hex().length(24).required(),
        fecha: Joi.date().iso().required()
    }),

    transactionUpdate: Joi.object({
        tipo: Joi.string().valid('ingreso', 'gasto'),
        monto: Joi.number().positive(),
        descripcion: Joi.string().allow(''),
        categoria: Joi.string().hex().length(24),
        fecha: Joi.date().iso()
    }).min(1),

    category: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().max(200).allow('').optional()
    }),

    categoryUpdate: Joi.object({
        name: Joi.string().min(2).max(50),
        description: Joi.string().max(200).allow('')
    }).min(1),

    budget: Joi.object({
        categoria: Joi.string().hex().length(24).required(),
        limite: Joi.number().positive().required(),
        mes: Joi.number().integer().min(1).max(12).required(),
        anio: Joi.number().integer().min(2000).required()
    }),

    budgetUpdate: Joi.object({
        categoria: Joi.string().hex().length(24),
        limite: Joi.number().positive(),
        mes: Joi.number().integer().min(1).max(12),
        anio: Joi.number().integer().min(2000)
    }).min(1),

    report: Joi.object({
        email: Joi.string().email().optional(),
        mes: Joi.number().integer().min(1).max(12).optional(),
        anio: Joi.number().integer().min(2000).optional()
    }).and('mes', 'anio'),

    objectId: Joi.object({
        id: Joi.string().hex().length(24).required()
    }),

    transactionFilters: Joi.object({
        tipo: Joi.string().valid('ingreso', 'gasto'),
        categoria: Joi.string().hex().length(24),
        mes: Joi.number().integer().min(1).max(12),
        anio: Joi.number().integer().min(2000),
        orden: Joi.string().valid('asc', 'desc')
    }).and('mes', 'anio'),

    budgetFilters: Joi.object({
        categoria: Joi.string().hex().length(24),
        mes: Joi.number().integer().min(1).max(12),
        anio: Joi.number().integer().min(2000)
    }),

    monthlyStats: Joi.object({
        mes: Joi.number().integer().min(1).max(12),
        anio: Joi.number().integer().min(2000)
    }),

    categoryStats: Joi.object({
        mes: Joi.number().integer().min(1).max(12),
        anio: Joi.number().integer().min(2000)
    }).and('mes', 'anio'),

    trends: Joi.object({
        meses: Joi.number().integer().min(1).max(24)
    })
}

export const validate = (schemaName, source = 'body') => (req, res, next) => {
    const schema = schemas[schemaName]
    if (!schema) return next()

    const { error, value } = schema.validate(req[source] ?? {}, {
        abortEarly: false,
        convert: true
    })

    if (error) {
        const messages = error.details.map(d => d.message)
        return next(createHttpError('Error de validación', 400, messages))
    }

    req.validated = { ...(req.validated ?? {}), [source]: value }
    if (source !== 'query') req[source] = value
    next()
}
