import ModeloMongoDB from "./usersMongoDB.js"

class ModelFactory {

    static get(tipo) {
        switch (tipo) {
            case 'MONGODB':
                console.log('**** Persistiendo en MongoDB Database ****')
                return new ModeloMongoDB()

            default:
                throw new Error('Tipo de persistencia no soportada')
        }
    }
}

export default ModelFactory