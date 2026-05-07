const { body, param } = require('express-validator');

exports.updateRoleValidation = [
  // Validate user ID parameter
  param('id')
    .isInt({ min: 1 }).withMessage('ID de usuario debe ser un número entero positivo'),

  // Validate role in body
  body('rol')
    .notEmpty().withMessage('Rol es requerido')
    .isIn(['usuario', 'trabajador', 'admin']).withMessage('Rol debe ser "usuario", "trabajador" o "admin"')
];