// backend/models/Transaccion.js
const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tipo: String,
  monto: Number,
  descripcion: String,
  estado: { type: String, default: 'completada' },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaccion', transaccionSchema);