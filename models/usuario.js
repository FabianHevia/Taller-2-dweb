const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    pass: {
        type: String,
        required: true,
    },
    perfil: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Perfil',
        required: true,
    },
});

usuarioSchema.pre('save', async function (next) {
    try {
        if (this.isModified('pass')) {
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);