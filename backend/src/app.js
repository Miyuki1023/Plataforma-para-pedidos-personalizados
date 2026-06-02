const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const addressRoutes = require('./routes/address.routes');
const categoryRoutes = require('./routes/categories.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

app.use(cors());
app.use(express.json());

// rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/categorias', categoryRoutes);
app.use('/api/orders', orderRoutes);

module.exports = app;