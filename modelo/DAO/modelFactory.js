import UsersMongoDB from "./usersMongoDB.js"
import CategoriesMongoDB from "./categoriesMongoDB.js"

class ModelFactory {

    static get(tipo, entidad = 'users') {
        switch (tipo) {
            case 'MONGODB':
                console.log('**** Persistiendo en MongoDB Database ****')
                switch (entidad) {
                    case 'users':
                        return new UsersMongoDB()
                    case 'categories':
                        return new CategoriesMongoDB()
                    default:
                        throw new Error('Entidad no soportada')
                }

            default:
                throw new Error('Tipo de persistencia no soportada')
        }
    }
}

export default ModelFactory