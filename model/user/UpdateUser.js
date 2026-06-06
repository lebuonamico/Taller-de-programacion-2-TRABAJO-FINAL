import Joi from 'joi'

class UpdateUser {

    static validate(data) {

        const schema = Joi.object({
            name: Joi.string()
                .min(2)
                .max(50),

            password: Joi.string()
                .min(8)
        })
            .min(1)
            .unknown(false)

        const { error } =
            schema.validate(data)

        if (error) {
            throw new Error(
                error.details[0].message
            )
        }
    }
}

export default UpdateUser