const mongoose = require('mongoose');

const rentaSchema = new mongoose.Schema({
    rut: {
        type: Number, // Usar Number en lugar de Int
        required: true,
    },
    fecha: {
        type: String,
        required: true,
    },
    plazo: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Renta', rentaSchema);