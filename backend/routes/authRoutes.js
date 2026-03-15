const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  register, 
  login, 
  getPerfil,
  updatePerfil,
  cambiarPassword 
} = require('../controllers/authController');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas (requieren token)
router.get('/perfil', protect, getPerfil);
router.put('/perfil', protect, updatePerfil);
router.put('/cambiar-password', protect, cambiarPassword);  // NUEVA RUTA

module.exports = router;