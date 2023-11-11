const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    idproducto: {
        type: Number,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    disponibilidad: {
        type: Number,
        required: true,
    },
    autor: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Producto', productoSchema);