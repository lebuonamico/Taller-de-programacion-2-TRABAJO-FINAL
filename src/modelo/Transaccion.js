import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
    {
        tipo: {
            type: String,
            enum: {
                values: ['ingreso', 'gasto'],
                message: 'El tipo debe ser ingreso o gasto'
            },
            required: [true, 'El tipo es requerido']
        },
        monto: {
            type: Number,
            required: [true, 'El monto es requerido'],
            min: [0.01, 'El monto debe ser mayor a 0']
        },
        descripcion: {
            type: String,
            trim: true,
            default: ''
        },
        categoria: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'La categoría es requerida']
        },
        fecha: {
            type: Date,
            required: [true, 'La fecha es requerida']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
)

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction
