// models/hamburguesa.js
const mongoose = require('mongoose');

const hamburguesaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  pan: String,
  proteina: String,
  ingredientes: [String],
  disenos: String,
  puntuacion: { type: Number, default: 0 },
  comentarios: [{ type: String }]
});

module.exports = mongoose.model('Hamburguesa', hamburguesaSchema);
