import ModelMongoDB from "./usersMongoDB.js"

class ModelFactory {

    static get(tipo) {
        switch (tipo) {
            case 'MONGODB':
                console.log('**** Persistiendo en MongoDB Database ****')
                return new ModelMongoDB()

            default:
                throw new Error('Tipo de persistencia no soportada')
        }
    }
}

export default ModelFactory