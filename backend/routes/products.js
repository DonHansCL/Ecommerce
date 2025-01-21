// backend/routes/products.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { Product, Category } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');


// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se almacenarán las imágenes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para evitar conflictos
  }
});

const fileFilter = (req, file, cb) => {
  // Aceptar solo archivos de imagen
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar a 5MB por archivo
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif).'));
  }
});

// Obtener Todos los Productos con Opcional Filtro por Categoría
router.get('/', async (req, res) => {
  try {
    const { categoria, featured } = req.query;
    const where = {};

    if (categoria) {
      where.categoriaId = categoria;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const products = await Product.findAll({
      where,
      include: [Category],
    });

    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos.' });
  }
});

// Obtener Detalles de un Producto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [Category],
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
});

// Crear un Nuevo Producto (Requiere Autenticación de Administrador)
router.post('/', authMiddleware, upload.array('imagenes', 5), async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.user.rol !== 'administrador') {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permisos' });
    }

    const { nombre, descripcion, precio, cantidadEnStock, categoriaId } = req.body;
    const imagenes = req.files.map(file => file.path); // Obtener las rutas de las imágenes

    // Validaciones
    if (!nombre || !descripcion || !precio || !cantidadEnStock || !categoriaId) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    const category = await Category.findByPk(categoriaId);
    if (!category) {
      return res.status(400).json({ error: 'Categoría inválida' });
    }

    const product = await Product.create({
      nombre,
      descripcion,
      precio,
      imagenes,
      cantidadEnStock,
      categoriaId,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error(error); // Log detallado del error
    res.status(400).json({ error: error.message || 'Error al crear el producto' });
  }
});

// Actualizar un Producto Existente (Solo Administradores)
router.put('/:id', authMiddleware, upload.array('imagenes', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidadEnStock, categoriaId, imagenesAEliminar } = req.body;

    const producto = await Product.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Validaciones básicas
    if (!nombre || !precio || cantidadEnStock == null || !categoriaId) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    // Verificar si la categoría existe
    const categoria = await Category.findByPk(categoriaId);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada.' });
    }

    // Actualizar los campos del producto
    producto.nombre = nombre;
    producto.descripcion = descripcion; // Asegúrate de que la descripción sea manejada correctamente
    producto.precio = precio;
    producto.cantidadEnStock = cantidadEnStock;
    producto.categoriaId = categoriaId;

    // Manejar nuevas imágenes
    if (req.files && req.files.length > 0) {
      const nuevasImagenes = req.files.map(file => file.path.replace(/\\/g, '/')); // Asegura rutas consistentes
      producto.imagenes = producto.imagenes.concat(nuevasImagenes);
    }

    // Manejar eliminación de imágenes
    if (imagenesAEliminar) {
      // Asegúrate de que 'imagenesAEliminar' sea un array
      let imagenesEliminarArray = [];
      if (typeof imagenesAEliminar === 'string') {
        imagenesEliminarArray.push(imagenesAEliminar);
      } else {
        imagenesEliminarArray = imagenesAEliminar;
      }

      imagenesEliminarArray.forEach(imgPath => {
        const index = producto.imagenes.indexOf(imgPath);
        if (index > -1) {
          producto.imagenes.splice(index, 1);
          // Eliminar el archivo del sistema de archivos
          fs.unlink(imgPath, (err) => {
            if (err) {
              console.error(`Error al eliminar la imagen ${imgPath}:`, err);
            }
          });
        }
      });
    }

    await producto.save();

    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
});

// Eliminar un Producto (Requiere Autenticación de Administrador)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'administrador') {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permisos' });
    }

    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Eliminar imágenes del sistema de archivos
    if (product.imagenes && product.imagenes.length > 0) {
      product.imagenes.forEach(imgPath => {
        fs.unlink(imgPath, (err) => {
          if (err) {
            console.error(`Error al eliminar la imagen ${imgPath}:`, err);
          }
        });
      });
    }

    await product.destroy();
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error(error); // Log detallado del error
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;