import Joi from 'joi'

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

    transaction: Joi.object({
        tipo: Joi.string().valid('ingreso', 'gasto').required(),
        monto: Joi.number().positive().required(),
        descripcion: Joi.string().allow('').optional(),
        categoria: Joi.string().hex().length(24).required(),
        fecha: Joi.date().iso().required()
    }),

    category: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().max(200).allow('').optional()
    }),

    budget: Joi.object({
        categoria: Joi.string().hex().length(24).required(),
        limite: Joi.number().positive().required(),
        mes: Joi.number().integer().min(1).max(12).required(),
        anio: Joi.number().integer().min(2000).required()
    }),

    report: Joi.object({
        email: Joi.string().email().optional(),
        mes: Joi.number().integer().min(1).max(12).optional(),
        anio: Joi.number().integer().min(2000).optional()
    })
}

export const validate = schemaName => (req, res, next) => {
    const schema = schemas[schemaName]
    if (!schema) return next()

    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
        const messages = error.details.map(d => d.message)
        return res.status(400).json({ error: 'Error de validación', detalles: messages })
    }

    next()
}
