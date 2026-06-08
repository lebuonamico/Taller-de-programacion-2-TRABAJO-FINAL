import Joi from 'joi'

class Transaccion {
    constructor({ tipo, monto, descripcion, idCategoria, fecha, userId }) {
        this.tipo = tipo
        this.monto = monto
        this.descripcion = descripcion
        this.idCategoria = idCategoria
        this.fecha = fecha
        this.userId = userId
    }

    validate() {
        const schema = Joi.object({
            tipo: Joi.string().valid('ingreso', 'gasto').required(),
            monto: Joi.number().positive().required(),
            descripcion: Joi.string().optional().allow(''),
            idCategoria: Joi.string().required(),
            fecha: Joi.string().isoDate().required(),
            userId: Joi.string().required()
        })

        const { error } = schema.validate({
            tipo: this.tipo,
            monto: this.monto,
            descripcion: this.descripcion,
            idCategoria: this.idCategoria,
            fecha: this.fecha,
            userId: this.userId
        })

        if (error) {
            throw new Error(error.details[0].message)
        }
    }

    toJSON() {
        return {
            tipo: this.tipo,
            monto: this.monto,
            descripcion: this.descripcion,
            idCategoria: this.idCategoria,
            fecha: this.fecha,
            userId: this.userId
        }
    }

    toPersistence() {
        return {
            tipo: this.tipo,
            monto: this.monto,
            descripcion: this.descripcion,
            idCategoria: this.idCategoria,
            fecha: this.fecha,
            userId: this.userId
        }
    }
}

export default Transaccion
