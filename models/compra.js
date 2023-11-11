const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
    idusuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    rut: {
        type: Number,  // Usar Number en lugar de Int
        required: true,
    },
    fecha: {
        type: String,
        required: true,
    },
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true,
    },
});

module.exports = mongoose.model('Compra', compraSchema);