const { body } = require('express-validator');

exports.registerValidation = [
  body('usuario')
    .notEmpty().withMessage('Usuario es requerido')
    .isLength({ min: 3 }).withMessage('Usuario mínimo 3 caracteres'),

  body('email')
    .notEmpty().withMessage('Email es requerido')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .notEmpty().withMessage('Password es requerido')
    .isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres')
    .matches(/[A-Z]/).withMessage('Debe tener al menos 1 mayúscula')
    .matches(/[0-9]/).withMessage('Debe tener al menos 1 número'),

];

exports.loginValidation = [
  body('email')
    .notEmpty().withMessage('Email es requerido')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .notEmpty().withMessage('Password es requerido')
];