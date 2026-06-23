import mongoose from 'mongoose'

const esquemaCategoria = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre es requerido'],
            minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
            maxlength: [50, 'El nombre no puede superar 50 caracteres'],
            trim: true
        },
        description: {
            type: String,
            maxlength: [200, 'La descripción no puede superar 200 caracteres'],
            trim: true,
            default: ''
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
)

const Categoria = mongoose.model('Category', esquemaCategoria)

export default Categoria
