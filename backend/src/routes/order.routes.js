const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate');
const {createOrderValidation,updateStatusValidation,searchOrdersValidation,assignWorkerValidation} = require('../validators/order.validator');

// Todas las rutas de pedidos requieren autenticación
router.use(authMiddleware);

// Crea pedido desde carrito (cliente, trabajador o admin)
router.post('/', checkRole(1, 2, 3),createOrderValidation, validate, orderController.createOrder);

// Obtener pedidos (cliente ve solo sus pedidos, empleado/admin ven todos)
router.get('/', searchOrdersValidation, validate, orderController.getOrders);

// Buscar pedidos por ID o estado (cliente solo puede buscar sus pedidos, empleado/admin pueden buscar todos)
router.get('/search', searchOrdersValidation, validate, orderController.searchOrder);

// Obtener detalles de un pedido por ID (cliente solo puede ver sus pedidos, empleado/admin pueden ver todos)
router.get('/:id', orderController.getOrderById);

// Actualizar estado de pedido (empleado o admin)
router.patch('/:id/status', checkRole(2, 3),updateStatusValidation, validate, orderController.updateOrderStatus);

// Asignar trabajador a pedido (admin)
router.patch('/:id/assign-worker', checkRole(3),assignWorkerValidation, validate, orderController.assignWorker);

// Obtener pedidos por rango de fechas (para calendario - empleado/admin)
router.get('/calendar/date-range', checkRole(2, 3),orderController.getOrdersByDate);

module.exports = router;