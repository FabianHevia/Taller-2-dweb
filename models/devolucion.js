const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    precio: Number,
    disponibilidad: Number,
    autor: String
});

module.exports = mongoose.model('producto', productoSchema);