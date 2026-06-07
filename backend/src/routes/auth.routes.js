const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { verifyToken, requireAdmin } = require('../middlewares/auth');
const { 
  forgotPasswordLimiter, 
  changePasswordLimiter,
  loginLimiter 
} = require('../middlewares/rateLimiter');
const {
  registerValidation,
  loginValidation,
  adminRegisterValidation
} = require('../validators/auth.validator');


router.post(
  '/register',
  registerValidation,
  validate,
  authController.register,
  authController.verifyAccount
);

router.post(
  '/verify-account', 
  authController.verifyAccount
);

router.post(
  '/resend-verification',
  authController.resendVerification
);

router.post(
  '/login',
  loginLimiter,
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
  forgotPasswordLimiter,
  authController.forgotPassword
);

router.post(
  '/change-password',
  verifyToken,
  changePasswordLimiter,
  authController.changePassword
);

module.exports = router;