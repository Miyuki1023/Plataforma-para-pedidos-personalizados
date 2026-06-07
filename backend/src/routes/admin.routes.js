const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const authController = require('../controllers/auth.controller');
const productController = require('../controllers/product.controller');
const validate = require('../middlewares/validate');
const { verifyToken, requireAdmin } = require('../middlewares/auth');
const { updateRoleValidation } = require('../validators/admin.validator');
const { adminRegisterValidation } = require('../validators/auth.validator');

// Obtener todos los usuarios (solo admin)
router.get('/users', verifyToken, requireAdmin, adminController.getAllUsers);

// Registrar nuevo usuario (solo admin)
router.post(
  '/users',
  verifyToken,
  requireAdmin,
  adminRegisterValidation,
  validate,
  authController.adminRegister
);

// Obtener usuario específico por ID (solo admin)
router.get('/users/:id', verifyToken, requireAdmin, adminController.getUserById);

// Actualizar usuario (solo admin)
router.put('/users/:id', verifyToken, requireAdmin, adminController.updateUser);

// Actualizar rol de usuario (solo admin)
router.put(
  '/users/:id/role',
  verifyToken,
  requireAdmin,
  updateRoleValidation,
  validate,
  adminController.updateUserRole
);

// Activar usuario (solo admin)
router.put('/users/:id/activate', verifyToken, requireAdmin, adminController.activateUser);

// Desactivar usuario (solo admin)
router.put('/users/:id/deactivate', verifyToken, requireAdmin, adminController.deactivateUser);

// Gestión de Productos (solo admin)
router.post('/productos', verifyToken, requireAdmin, productController.createProduct);
router.put('/productos/:id', verifyToken, requireAdmin, productController.updateProduct);
router.get('/productos/:id/options', verifyToken, requireAdmin, productController.getProductOptions);
router.post('/productos/:id/options', verifyToken, requireAdmin, productController.createOption);

// Establecer meta diaria (solo admin)
router.post('/meta', verifyToken, requireAdmin, adminController.createGoal);

// Actualizar meta diaria (solo admin)
router.put('/meta/:fecha', verifyToken, requireAdmin, adminController.updateGoal);

// Obtener la cantidad de pedidos segun el dia (solo admin)
router.get('/meta/:fecha', verifyToken, requireAdmin, adminController.getGoalByDate);

module.exports = router;