// backend/models/Cuenta.js
const mongoose = require('mongoose');

const cuentaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  saldo: { type: Number, default: 15000.59 }
});

module.exports = mongoose.model('Cuenta', cuentaSchema);