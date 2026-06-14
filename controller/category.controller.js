import Service from '../servicio/category.service.js'


class CategoryController {
    #service = null

    constructor() {
        this.#service = new Service()
    }

    getCategories = async (req, res) => {

        try {

            const categories =
                await this.#service.getCategories(
                    req.user.id
                )

            res.json(categories)

        }
        catch (error) {

            res.status(400).json({
                error: error.message
            })

        }
    }

    createCategory = async (req, res) => {

        try {

            const createdCategory =
                await this.#service.createCategory(
                    req.user.id,
                    req.body
                )

            res.status(201).json(createdCategory)

        }
        catch (error) {

            res.status(400).json({
                error: error.message
            })

        }
    }

    updateCategory = async (req, res) => {

        try {

            const updatedCategory =
                await this.#service.updateCategory(
                    req.user.id,
                    req.params.id,
                    req.body
                )

            res.json(updatedCategory)

        }
        catch (error) {

            res.status(404).json({
                error: error.message
            })

        }
    }

    deleteCategory = async (req, res) => {

        try {

            const result =
                await this.#service.deleteCategory(
                    req.user.id,
                    req.params.id
                )

            res.json(result)

        }
        catch (error) {

            res.status(404).json({
                error: error.message
            })

        }
    }
}

export default CategoryController
