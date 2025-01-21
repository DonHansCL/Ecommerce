require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize, User, Product, Category, Cart, CartItem, Order } = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');
const cors = require('cors'); 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Configurar CORS
app.use(cors({
    origin: 'http://localhost:3000', // URL del frontend
    credentials: true,
  }));

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOADS_DIR)));
app.use('/uploads/categories', express.static(path.join(__dirname, 'uploads/categories')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configurar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Usar Rutas
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/carts', cartRoutes);
  app.use('/api/pedidos', orderRoutes);
  app.use('/api/categories', categoryRoutes);
  
  // Ruta Principal
  app.get('/', (req, res) => {
    res.send('Backend server está corriendo');
  });

// Conectar a la base de datos y sincronizar modelos
sequelize.authenticate()
  .then(() => {
    console.log('Conectado a la base de datos');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Modelos sincronizados');
    // Iniciar el servidor después de sincronizar
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => console.error('Error de conexión:', err));