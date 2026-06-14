import Service from '../service/user.service.js'


class UserController {
    #service = null

    constructor() {
        this.#service = new Service()
    }
    createUser = async (req, res) => {

        try {

            const user = req.body

            const createdUser =
                await this.#service.createUser(user)

            res.status(201).json(createdUser)

        }
        catch (error) {

            res.status(400).json({
                error: error.message
            })

        }
    }

    loginUser = async (req, res) => {

        try {

            const { email, password } = req.body

            const user =
                await this.#service.loginUser(
                    email,
                    password
                )

            res.json(user)

        }
        catch (error) {

            res.status(401).json({
                error: error.message
            })

        }
    }

    getProfile = async (req, res) => {

        try {

            const user =
                await this.#service.getProfile(
                    req.user.id
                )

            res.json(user)

        }
        catch (error) {

            res.status(404).json({
                error: error.message
            })

        }
    }

    updateProfile = async (req, res) => {
        try {
            const updatedUser = await this.#service.updateProfile(
                req.user.id,
                req.body
            )

            res.json(updatedUser)
        }
        catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    }
    deleteProfile = async (req, res) => {

        try {

            await this.#service.deleteProfile(
                req.user.id
            )

            res.json({
                message: 'User deleted successfully'
            })

        }
        catch (error) {

            res.status(404).json({
                error: error.message
            })

        }
    }
}

export default UserController