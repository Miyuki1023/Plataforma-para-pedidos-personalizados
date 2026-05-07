const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const validate = require('../middlewares/validate');
const { verifyToken, requireAdmin } = require('../middlewares/auth');
const { updateRoleValidation } = require('../validators/admin.validator');

// Get all users (admin only)
router.get('/users', verifyToken, requireAdmin, adminController.getAllUsers);

// Get specific user by ID (admin only)
router.get('/users/:id', verifyToken, requireAdmin, adminController.getUserById);

// Update user role (admin only)
router.put(
  '/users/:id/role',
  verifyToken,
  requireAdmin,
  updateRoleValidation,
  validate,
  adminController.updateUserRole
);

// Activate user (admin only)
router.put('/users/:id/activate', verifyToken, requireAdmin, adminController.activateUser);

// Deactivate user (admin only)
router.put('/users/:id/deactivate', verifyToken, requireAdmin, adminController.deactivateUser);

module.exports = router;