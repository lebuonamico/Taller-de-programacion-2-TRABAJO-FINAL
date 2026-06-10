import Joi from 'joi'

class Category {
    constructor({ name, description, userId }) {
        this.name = name
        this.description = description
        this.userId = userId
    }

    validate() {
        const schema = Joi.object({
            name: Joi.string().min(2).max(50).required(),
            description: Joi.string().max(200).allow('').optional(),
            userId: Joi.string().required()
        })

        const { error } = schema.validate({
            name: this.name,
            description: this.description,
            userId: this.userId
        })

        if (error) {
            throw new Error(error.details[0].message)
        }
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description
        }
    }

    toPersistence() {
        return {
            name: this.name,
            description: this.description,
            userId: this.userId
        }
    }
}

export default Category
