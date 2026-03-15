const User = require('../models/User');
const Cuenta = require('../models/Cuenta'); // Agregado para obtener datos de cuenta
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Registrar usuario
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Completa todos los campos obligatorios' 
      });
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'El email ya está registrado' 
      });
    }

    // Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en MongoDB
    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      telefono: telefono || '',
      prefijo: 'billetera_virtual',
      version: '1.0.0'
    });

    console.log(`✅ Usuario registrado: ${user.email} - ID: ${user._id}`);

    // Generar token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secreto_temporal',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registro exitoso',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono
      }
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor: ' + error.message
    });
  }
};

// @desc    Login usuario
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Ingresa email y contraseña' 
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Contraseña incorrecta' 
      });
    }

    // Actualizar último acceso
    user.ultimoAcceso = new Date();
    await user.save();

    // Generar token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secreto_temporal',
      { expiresIn: '7d' }
    );

    console.log(`✅ Login exitoso: ${user.email}`);

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor: ' + error.message
    });
  }
};

// @desc    Obtener perfil del usuario (MEJORADO con datos de cuenta)
// @route   GET /api/auth/perfil
exports.getPerfil = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Obtener cuenta asociada
    const cuenta = await Cuenta.findOne({ usuarioId: user._id });

    res.json({
      success: true,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono || '',
        fechaRegistro: user.fechaRegistro,
        cuenta: cuenta ? {
          id: cuenta._id,
          saldo: cuenta.saldo,
          moneda: cuenta.moneda || 'ARS'
        } : null
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

// @desc    Actualizar perfil
// @route   PUT /api/auth/perfil
exports.updatePerfil = async (req, res) => {
  try {
    const { nombre, telefono } = req.body;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { nombre, telefono },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Perfil actualizado',
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono
      }
    });

  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

// @desc    Cambiar contraseña (NUEVA FUNCIÓN)
// @route   PUT /api/auth/cambiar-password
exports.cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    // Validaciones
    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({ 
        success: false, 
        message: 'Completá todos los campos' 
      });
    }

    if (passwordNueva.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'La nueva contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Buscar usuario con password
    const usuario = await User.findById(req.user.id);
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Verificar contraseña actual
    const esValida = await bcrypt.compare(passwordActual, usuario.password);
    if (!esValida) {
      return res.status(401).json({ 
        success: false, 
        message: 'La contraseña actual es incorrecta' 
      });
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(passwordNueva, 10);
    usuario.password = hashedPassword;
    await usuario.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al cambiar contraseña' 
    });
  }
};