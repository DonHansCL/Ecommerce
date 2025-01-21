const express = require('express');
const multer = require('multer');
const path = require('path');
const { Category } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Configuración de Multer para manejar imágenes de categorías
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/categories/'); // Carpeta donde se guardarán las imágenes de categorías
  },
  filename: (req, file, cb) => {
    // Nombre único para evitar conflictos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrar solo archivos de imagen
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Obtener Todas las Categorías
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener las categorías:', error); // Log detallado
    res.status(500).json({ 
      error: 'Error al obtener las categorías',
      details: error.message // Envía detalles del error al frontend
    });
  }
});

// Crear una Nueva Categoría (Requiere Autenticación de Administrador)
router.post('/', authMiddleware, upload.single('imagen'), async (req, res) => {
  // Verificar si el usuario es administrador
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado: No tienes permisos' });
  }

  const { nombre, descripcion } = req.body;
  let imagen = null;
  if (req.file) {
    imagen = req.file.filename;
  }

  try {
    const category = await Category.create({ nombre, descripcion, imagen });
    res.status(201).json(category);
  } catch (error) {
    console.error('Error al crear la categoría:', error); // Log detallado
    res.status(400).json({ 
      error: 'Error al crear la categoría',
      details: error.message 
    });
  }
});

// Actualizar una Categoría (Requiere Autenticación de Administrador)
router.put('/:id', authMiddleware, upload.single('imagen'), async (req, res) => {
  // Verificar si el usuario es administrador
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado: No tienes permisos' });
  }

  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Si se sube una nueva imagen, actualizar el campo 'imagen'
    if (req.file) {
      category.imagen = req.file.filename;
    }

    category.nombre = nombre || category.nombre;
    category.descripcion = descripcion || category.descripcion;

    await category.save();
    res.json(category);
  } catch (error) {
    console.error('Error al actualizar la categoría:', error); // Log detallado
    res.status(400).json({ 
      error: 'Error al actualizar la categoría',
      details: error.message 
    });
  }
});

// Eliminar una Categoría (Requiere Autenticación de Administrador)
router.delete('/:id', authMiddleware, async (req, res) => {
  // Verificar si el usuario es administrador
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado: No tienes permisos' });
  }

  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await category.destroy();
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la categoría:', error); // Log detallado
    res.status(500).json({ 
      error: 'Error al eliminar la categoría',
      details: error.message 
    });
  }
});

// Middleware de manejo de errores de Multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Error de Multer
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Otros errores
    return res.status(500).json({ error: err.message });
  }
  next();
});

module.exports = router;