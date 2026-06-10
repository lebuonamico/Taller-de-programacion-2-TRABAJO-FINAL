import Joi from 'joi'

class Presupuesto {
    constructor({ idCategoria, limite, mes, anio, userId }) {
        this.idCategoria = idCategoria
        this.limite = limite
        this.mes = mes
        this.anio = anio
        this.userId = userId
    }

    validate() {
        const schema = Joi.object({
            idCategoria: Joi.string().required(),
            limite: Joi.number().positive().required(),
            mes: Joi.number().integer().min(1).max(12).required(),
            anio: Joi.number().integer().required(),
            userId: Joi.string().required()
        })

        const { error } = schema.validate({
            idCategoria: this.idCategoria,
            limite: this.limite,
            mes: this.mes,
            anio: this.anio,
            userId: this.userId
        })

        if (error) {
            throw new Error(error.details[0].message)
        }
    }

    toJSON() {
        return {
            idCategoria: this.idCategoria,
            limite: this.limite,
            mes: this.mes,
            anio: this.anio,
            userId: this.userId
        }
    }

    toPersistence() {
        return {
            idCategoria: this.idCategoria,
            limite: this.limite,
            mes: this.mes,
            anio: this.anio,
            userId: this.userId
        }
    }
}

export default Presupuesto
