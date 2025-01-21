// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const { User } = require('../models');
const router = express.Router();

// Ruta para iniciar sesión y obtener el token
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const user = await User.findOne({ where: { correo } });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado.' });
    
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) return res.status(400).json({ error: 'Contraseña incorrecta.' });
    
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});

// Ruta para obtener los datos del usuario autenticado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nombre', 'correo', 'rol'],
    });
    res.json({ user });
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});

module.exports = router;