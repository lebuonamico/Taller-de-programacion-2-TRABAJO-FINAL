import Category from '../modelo/Category.js'
import ModelFactory from '../modelo/DAO/modelFactory.js'
import config from '../config.js'

class CategoryService {
    #modelo = null

    constructor() {
        const modo = config.MODO_PERSISTENCIA
        this.#modelo = ModelFactory.get(modo, 'categories')
    }

    getCategories = async userId => {

        return await this.#modelo.findByUser(userId)
    }

    createCategory = async (userId, data) => {

        const newCategory = new Category({
            name: data.name,
            description: data.description,
            userId
        })

        newCategory.validate()

        return await this.#modelo.create(
            newCategory.toPersistence()
        )
    }

    updateCategory = async (userId, id, data) => {

        const category =
            await this.#modelo.findById(id)

        if (!category || category.userId !== userId) {
            throw new Error('Category not found')
        }

        const updatedCategory = new Category({
            name: data.name,
            description: data.description,
            userId
        })

        updatedCategory.validate()

        await this.#modelo.update(
            id,
            userId,
            {
                name: updatedCategory.name,
                description: updatedCategory.description
            }
        )

        return updatedCategory.toJSON()
    }

    deleteCategory = async (userId, id) => {

        const category =
            await this.#modelo.findById(id)

        if (!category || category.userId !== userId) {
            throw new Error('Category not found')
        }

        await this.#modelo.delete(id, userId)

        return { message: 'Category deleted' }
    }
}

export default CategoryService
