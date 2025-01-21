const express = require('express');
const { Cart, CartItem, Product } = require('../models');;
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Helper para decodificar token
const decodeToken = (token) => {
  const jwt = require('jsonwebtoken');
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
  } catch (error) {
    return null;
  }
};

// Obtener el Carrito del Usuario (Requiere Autenticación)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { usuarioId: req.user.id },
      include: {
        model: CartItem,
        include: [{ model: Product, as: 'product' }],
      },
    });

    if (!cart) {
      return res.status(200).json({ message: 'Carrito está vacío', cartItems: [] });
    }

    res.json({ cartItems: cart.CartItems });
  } catch (error) {
    console.error('Error al obtener el carrito:', error.stack);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Agregar un Producto al Carrito
router.post('/add', authMiddleware, async (req, res) => {
  const { productoId, cantidad } = req.body;

  if (!productoId || cantidad < 1) {
    return res.status(400).json({ error: 'Producto y cantidad son requeridos' });
  }

  try {
    const product = await Product.findByPk(productoId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    let cart = await Cart.findOne({ where: { usuarioId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ usuarioId: req.user.id });
    }

    const [cartItem, created] = await CartItem.findOrCreate({
      where: { carritoId: cart.id, productoId },
      defaults: { cantidad },
    });

    if (!created) {
      cartItem.cantidad += cantidad;
      await cartItem.save();
      console.log(`Cantidad actualizada para el producto: ID ${productoId}, Nueva cantidad: ${cartItem.cantidad}`);
    } else {
      console.log(`Producto agregado al carrito: ID ${productoId}, Cantidad: ${cantidad}`);
    }

    res.status(200).json({ message: 'Producto agregado al carrito', cartItem });
  } catch (error) {
    console.error('Error al agregar al carrito:', error.stack);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});


// Actualizar la Cantidad de un Producto en el Carrito (Requiere Autenticación)
router.put('/update', authMiddleware, async (req, res) => {
  const { productoId, cantidad } = req.body;

  if (!productoId || cantidad < 1) {
    return res.status(400).json({ error: 'Producto y cantidad son requeridos' });
  }

  try {
    const cart = await Cart.findOne({ where: { usuarioId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const cartItem = await CartItem.findOne({
      where: {
        carritoId: cart.id,
        productoId: productoId,
      },
      include: [{ model: Product, as: 'product' }],
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    cartItem.cantidad = cantidad;
    await cartItem.save();

    res.status(200).json({ message: 'Cantidad actualizada', cartItem });
  } catch (error) {
    console.error('Error al actualizar la cantidad:', error.stack); // Log detallado
    res.status(500).json({ error: 'Error al actualizar la cantidad' });
  }
});


// Eliminar un Producto del Carrito (Requiere Autenticación)
router.delete('/remove/:productoId', authMiddleware, async (req, res) => {
  const { productoId } = req.params;

  try {
    const cart = await Cart.findOne({ where: { usuarioId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const cartItem = await CartItem.findOne({
      where: {
        carritoId: cart.id,
        productoId: productoId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }
    await cartItem.destroy();
    res.status(200).json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar del carrito:', error.stack); // Log detallado
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
});

// Limpiar el Carrito (Requiere Autenticación)
router.post('/clear', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { usuarioId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    await CartItem.destroy({ where: { carritoId: cart.id } });
    res.status(200).json({ message: 'Carrito limpiado' });
  } catch (error) {
    console.error('Error al limpiar el carrito:', error.stack); // Log detallado
    res.status(500).json({ error: 'Error al limpiar el carrito' });
  }
});

module.exports = router;