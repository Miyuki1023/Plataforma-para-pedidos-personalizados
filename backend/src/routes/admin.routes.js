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

//establecer meta diaria
router.post('/meta', adminController.createGoal);

//actualizar meta diaria
router.put('/meta/:fecha', adminController.updateGoal);

//obtener la cantidad de pedidos segun el dia
router.get('/meta/:fecha',adminController.getGoalByDate);

module.exports = router;