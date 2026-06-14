import ModeloMongoDB from "./usersMongoDB.js"
import TransaccionesMongoDB from "./transaccionesMongoDB.js"
import PresupuestosMongoDB from "./presupuestosMongoDB.js"
import CategoriesMongoDB from "./categoriesMongoDB.js"

class ModelFactory {

    static get(tipo, entidad = 'users') {
        switch (tipo) {
            case 'MONGODB':
                console.log('**** Persistiendo en MongoDB Database ****')
                switch (entidad) {
                    case 'users':
                        return new ModeloMongoDB()
                    case 'categories':
                        return new CategoriesMongoDB()
                    default:
                        throw new Error('Entidad no soportada')
                }

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

    static getPresupuestos(tipo) {
        switch (tipo) {
            case 'MONGODB':
                return new PresupuestosMongoDB()

            default:
                throw new Error('Tipo de persistencia no soportada')
        }
    }
}

export default ModelFactory