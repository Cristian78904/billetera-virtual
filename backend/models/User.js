const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  fechaRegistro: { type: Date, default: Date.now },
  estado: { type: String, default: 'activo' }
});

// 👇 ESTO ES CLAVE: Fuerza el nombre de la colección a "usuarios"
module.exports = mongoose.model('User', UserSchema, 'usuarios');