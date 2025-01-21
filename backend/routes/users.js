// filepath: backend/routes/users.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Registro de Usuario
router.post('/register', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;
  try {
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const user = await User.create({
      nombre,
      correo,
      contraseña: hashedPassword,
    });
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Inicio de Sesión
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const user = await User.findOne({ where: { correo } });
    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener Todos los Usuarios (Requiere Autenticación de Administrador)
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado: No tienes permisos' });
  }

  try {
    const users = await User.findAll({
      attributes: { exclude: ['contraseña'] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Bloquear/Desbloquear Usuario (Requiere Autenticación de Administrador)
router.put('/block/:id', authMiddleware, async (req, res) => {
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado: No tienes permisos' });
  }

  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Alternar el rol entre 'cliente_bloqueado' y 'cliente'
    user.rol = user.rol === 'cliente' ? 'cliente_bloqueado' : 'cliente';
    await user.save();
    res.json({ message: 'Estado del usuario actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nombre', 'correo', 'rol', 'fechaRegistro'],
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error en /me:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

module.exports = router;