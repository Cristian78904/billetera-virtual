// backend/controllers/transaccionController.js
const Transaccion = require('../models/Transaccion');
const Cuenta = require('../models/Cuenta');
const User = require('../models/User');

// @desc    Realizar transferencia (CON VALIDACIÓN Y CONFIRMACIÓN)
exports.realizarTransferencia = async (req, res) => {
  try {
    const { cuentaDestino, monto, descripcion } = req.body;
    const usuarioId = req.user.id;

    // Validaciones básicas
    if (!cuentaDestino || !monto) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cuenta destino y monto son requeridos' 
      });
    }

    if (monto <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'El monto debe ser mayor a 0' 
      });
    }

    // Validar que la cuenta destino exista (OPCIÓN 3)
    let cuentaDestinoObj;
    
    // Buscar por email (si es un email)
    if (cuentaDestino.includes('@')) {
      const userDestino = await User.findOne({ email: cuentaDestino });
      if (!userDestino) {
        return res.status(404).json({ 
          success: false, 
          message: 'No existe usuario con ese email' 
        });
      }
      cuentaDestinoObj = await Cuenta.findOne({ usuarioId: userDestino._id });
    } 
    // Buscar por ID de MongoDB
    else if (cuentaDestino.length === 24) {
      cuentaDestinoObj = await Cuenta.findById(cuentaDestino);
    }
    // Buscar por número de cuenta (simulado)
    else {
      // Buscar en todas las cuentas (para demo, tomamos la primera que no sea la nuestra)
      cuentaDestinoObj = await Cuenta.findOne({ 
        usuarioId: { $ne: usuarioId } 
      });
    }

    if (!cuentaDestinoObj) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cuenta destino no encontrada' 
      });
    }

    // Obtener cuenta del usuario
    let cuentaOrigen = await Cuenta.findOne({ usuarioId });
    if (!cuentaOrigen) {
      cuentaOrigen = await Cuenta.create({
        usuarioId,
        saldo: 15000.59
      });
    }

    // Verificar saldo suficiente
    if (cuentaOrigen.saldo < monto) {
      return res.status(400).json({ 
        success: false, 
        message: `Saldo insuficiente. Tenés $${cuentaOrigen.saldo}`
      });
    }

    // Actualizar saldos
    cuentaOrigen.saldo = parseFloat((cuentaOrigen.saldo - monto).toFixed(2));
    cuentaDestinoObj.saldo = parseFloat((cuentaDestinoObj.saldo + monto).toFixed(2));
    
    await cuentaOrigen.save();
    await cuentaDestinoObj.save();

    // Registrar transacción
    const transaccion = await Transaccion.create({
      usuarioId,
      tipo: 'transferencia',
      monto,
      descripcion: descripcion || 'Transferencia',
      cuentaDestino: cuentaDestinoObj._id,
      estado: 'completada'
    });

    res.json({
      success: true,
      message: 'Transferencia exitosa',
      transaccion,
      nuevoSaldo: cuentaOrigen.saldo
    });

  } catch (error) {
    console.error('Error en transferencia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al procesar la transferencia: ' + error.message 
    });
  }
};

// @desc    Realizar depósito (OPCIÓN 1 - NUEVO)
exports.realizarDeposito = async (req, res) => {
  try {
    const { monto } = req.body;
    const usuarioId = req.user.id;

    if (!monto || monto <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ingresá un monto válido' 
      });
    }

    // Buscar o crear cuenta
    let cuenta = await Cuenta.findOne({ usuarioId });
    if (!cuenta) {
      cuenta = await Cuenta.create({
        usuarioId,
        saldo: 15000.59
      });
    }

    // Actualizar saldo
    cuenta.saldo = parseFloat((cuenta.saldo + monto).toFixed(2));
    await cuenta.save();

    // Registrar transacción
    await Transaccion.create({
      usuarioId,
      tipo: 'deposito',
      monto,
      descripcion: 'Depósito',
      estado: 'completada'
    });

    res.json({
      success: true,
      message: 'Depósito exitoso',
      nuevoSaldo: cuenta.saldo
    });

  } catch (error) {
    console.error('Error en depósito:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al procesar el depósito' 
    });
  }
};

// @desc    Obtener historial
exports.obtenerHistorial = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const transacciones = await Transaccion.find({ usuarioId })
      .sort({ fecha: -1 })
      .limit(50);
    
    res.json({ success: true, transacciones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtener saldo
exports.obtenerSaldo = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    let cuenta = await Cuenta.findOne({ usuarioId });
    
    if (!cuenta) {
      cuenta = await Cuenta.create({
        usuarioId,
        saldo: 15000.59
      });
    }

    res.json({ success: true, saldo: cuenta.saldo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};