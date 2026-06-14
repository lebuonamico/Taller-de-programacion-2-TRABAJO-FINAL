import { ObjectId } from "mongodb"
import CnxMongoDB from "../MongoDB.js"


class CategoriesMongoDB {

    async create(category) {

        if (!CnxMongoDB.connectionOK) {
            throw new Error('Database connection error')
        }

        await CnxMongoDB.db
            .collection('categories')
            .insertOne(category)

        return category
    }

    async findByUser(userId) {

        if (!CnxMongoDB.connectionOK) {
            throw new Error('Database connection error')
        }

        return await CnxMongoDB.db
            .collection('categories')
            .find({ userId })
            .toArray()
    }

    async findById(id) {

        if (!CnxMongoDB.connectionOK) {
            throw new Error('Database connection error')
        }

        return await CnxMongoDB.db
            .collection('categories')
            .findOne({
                _id: new ObjectId(id)
            })
    }

    async update(id, userId, data) {

        if (!CnxMongoDB.connectionOK) {
            throw new Error('Database connection error')
        }

        return await CnxMongoDB.db
            .collection('categories')
            .updateOne(
                { _id: new ObjectId(id), userId },
                { $set: data }
            )
    }

    async delete(id, userId) {

        if (!CnxMongoDB.connectionOK) {
            throw new Error('Database connection error')
        }

        return await CnxMongoDB.db
            .collection('categories')
            .deleteOne({
                _id: new ObjectId(id),
                userId
            })
    }

}

export default CategoriesMongoDB
