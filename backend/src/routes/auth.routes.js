const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { verifyToken, requireAdmin } = require('../middlewares/auth');
const {
  registerValidation,
  loginValidation,
  adminRegisterValidation
} = require('../validators/auth.validator');

router.post(
  '/register',
  registerValidation,
  validate,
  authController.register
);

router.post(
  '/verify', 
  authController.verifyAccount
);

router.post(
  '/login',
  loginValidation,
  validate,
  authController.login
);

router.post(
  '/logout',
  verifyToken,
  authController.logout
);

router.post(
  '/admin/register',
  verifyToken,
  requireAdmin,
  adminRegisterValidation,
  validate,
  authController.adminRegister
);

router.post(
  '/forgot-password',
  authController.forgotPassword
);

router.post(
  '/change-password',
  authController.changePassword
);

module.exports = router;