import mongoose from 'mongoose'

const esquemaPresupuesto = new mongoose.Schema(
    {
        categoria: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'La categoría es requerida']
        },
        limite: {
            type: Number,
            required: [true, 'El límite es requerido'],
            min: [0.01, 'El límite debe ser mayor a 0']
        },
        mes: {
            type: Number,
            required: [true, 'El mes es requerido'],
            min: [1, 'El mes debe estar entre 1 y 12'],
            max: [12, 'El mes debe estar entre 1 y 12']
        },
        anio: {
            type: Number,
            required: [true, 'El año es requerido'],
            min: [2000, 'El año debe ser válido']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
)

const Presupuesto = mongoose.model('Budget', esquemaPresupuesto)

export default Presupuesto
