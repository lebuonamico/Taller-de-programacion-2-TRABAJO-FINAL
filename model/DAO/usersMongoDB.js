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
    async updateUser(id, user) {

        await CnxMongoDB.db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    name: user.name,
                    password: user.password
                }
            }
        )

        return await this.findById(id)
    }

}

export default UsersMongoDB



