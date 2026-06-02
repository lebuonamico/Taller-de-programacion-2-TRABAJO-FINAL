import { ObjectId } from "mongodb"
import CnxMongoDB from "../MongoDB.js"


class UsersMongoDB {

    async create(user) {

        if (!CnxMongoDB.connectionOK) {
            throw new Error('Database connection error')
        }

        await CnxMongoDB.db
            .collection('users')
            .insertOne(user)

        return user
    }

    async findByEmail(email) {

        if (!CnxMongoDB.connectionOK) {
            throw new Error('Database connection error')
        }

        return await CnxMongoDB.db
            .collection('users')
            .findOne({ email })
    }

    async findById(id) {

        if (!CnxMongoDB.connectionOK) {
            throw new Error('Database connection error')
        }

        return await CnxMongoDB.db
            .collection('users')
            .findOne({
                _id: new ObjectId(id)
            })
    }

}

export default UsersMongoDB



