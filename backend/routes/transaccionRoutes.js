// backend/routes/transaccionRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  realizarTransferencia,
  realizarDeposito,
  obtenerHistorial,
  obtenerSaldo 
} = require('../controllers/transaccionController');

router.use(protect);

router.post('/transferir', realizarTransferencia);
router.post('/deposito', realizarDeposito);  // NUEVA RUTA
router.get('/historial', obtenerHistorial);
router.get('/saldo', obtenerSaldo);

module.exports = router;