import Joi from 'joi'

class User {
    constructor({ name, email, password }) {
        this.name = name
        this.email = email
        this.password = password
    }

    validate() {
        const schema = Joi.object({
            name: Joi.string().min(2).max(50).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required()
        })

        const { error } = schema.validate({
            name: this.name,
            email: this.email,
            password: this.password
        })

        if (error) {
            throw new Error(error.details[0].message)
        }
    }

    toJSON() {
        return {
            name: this.name,
            email: this.email
        }
    }

    toPersistence() {
        return {
            name: this.name,
            email: this.email,
            password: this.password
        }
    }
}

export default User