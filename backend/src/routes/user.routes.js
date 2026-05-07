const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate');
const { verifyToken } = require('../middlewares/auth');
const { updateProfileValidation } = require('../validators/user.validator');

// Get user profile
router.get('/profile', verifyToken, userController.getProfile);

// Update user profile
router.put(
  '/profile',
  verifyToken,
  updateProfileValidation,
  validate,
  userController.updateProfile
);

module.exports = router;