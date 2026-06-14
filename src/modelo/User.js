import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre es requerido'],
            minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
            maxlength: [50, 'El nombre no puede superar 50 caracteres'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'El email es requerido'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'El email no es válido']
        },
        password: {
            type: String,
            required: [true, 'La contraseña es requerida'],
            minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
        }
    },
    { timestamps: true }
)

userSchema.methods.toJSON = function () {
    const { _id, name, email, createdAt } = this.toObject()
    return { id: _id, name, email, createdAt }
}

const User = mongoose.model('User', userSchema)

export default User
