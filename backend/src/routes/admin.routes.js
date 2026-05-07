const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const validate = require('../middlewares/validate');
const { verifyToken, requireAdmin } = require('../middlewares/auth');
const { updateRoleValidation } = require('../validators/admin.validator');

// Obtener todos los usuarios (solo admin)
router.get('/users', verifyToken, requireAdmin, adminController.getAllUsers);

// Obtener usuario específico por ID (solo admin)
router.get('/users/:id', verifyToken, requireAdmin, adminController.getUserById);

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

module.exports = router;