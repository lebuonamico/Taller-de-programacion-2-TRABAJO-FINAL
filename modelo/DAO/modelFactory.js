import ModeloMongoDB from "./usersMongoDB.js"
import TransaccionesMongoDB from "./transaccionesMongoDB.js"

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

    static getTransacciones(tipo) {
        switch (tipo) {
            case 'MONGODB':
                return new TransaccionesMongoDB()

            default:
                throw new Error('Tipo de persistencia no soportada')
        }
    }
}

export default ModelFactory