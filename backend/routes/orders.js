// backend/routes/orders.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { Cart, CartItem, Order, Product, User, OrderItem, sequelize } = require('../models'); // Asegúrate de importar OrderItem
const router = express.Router();


// Realizar Checkout y Crear Pedido
router.post('/checkout', authMiddleware, async (req, res) => {
  const { direccionEnvio, metodoPago } = req.body;
  const t = await sequelize.transaction();

  try {
    // 1. Get cart with items
    const cart = await Cart.findOne({
      where: { usuarioId: req.user.id },
      include: [{
        model: CartItem,
        include: [{ 
          model: Product,
          as: 'product'
        }]
      }],
      transaction: t
    });

    console.log('Cart retrieved:', JSON.stringify(cart, null, 2));

    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // 2. Calculate total
    let total = cart.CartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.product.precio) * item.cantidad);
    }, 0);

    console.log('Total calculated:', total);

    // 3. Create order
    const order = await Order.create({
      usuarioId: req.user.id,
      total: total,
      direccionEnvio,
      metodoPago,
      estado: 'pendiente'
    }, { transaction: t });

    console.log('Order created:', order.toJSON());

    // 4. Create order items
    for (const cartItem of cart.CartItems) {
      console.log('Creating OrderItem for product:', cartItem.product.id);
      await OrderItem.create({
        orderId: order.id,
        productId: cartItem.product.id, // Correct field name
        cantidad: cartItem.cantidad,
        precio: cartItem.product.precio
      }, { transaction: t });
    }

    // 5. Clear cart
    await CartItem.destroy({
      where: { carritoId: cart.id },
      transaction: t
    });

    // 6. Commit transaction
    await t.commit();

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      order: order
    });

  } catch (error) {
    await t.rollback();
    console.error('Error en checkout:', error);
    res.status(500).json({
      error: 'Error al procesar el pedido',
      details: error.message
    });
  }
});


// Obtener Historial de Pedidos del Usuario o Todos si es Admin
router.get('/', authMiddleware, async (req, res) => {
  try {
    const isAdmin = req.user.rol === 'administrador';

    const orders = await Order.findAll({
      where: isAdmin ? {} : { usuarioId: req.user.id },
      include: [
        {
          model: User,
          attributes: ['nombre', 'correo']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'nombre', 'precio', 'imagenes']
          }]
        }
      ],
      order: [['id', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ 
      error: 'Error al obtener los pedidos', 
      details: error.message 
    });
  }
});

module.exports = router;