const { body, param } = require('express-validator');

exports.updateRoleValidation = [
  // Validar ID de usuario en parámetro
  param('id')
    .isInt({ min: 1 }).withMessage('ID de usuario debe ser un número entero positivo'),

  // Validar rol en el cuerpo
  body('rol')
    .notEmpty().withMessage('Rol es requerido')
    .isIn(['usuario', 'trabajador', 'admin']).withMessage('Rol debe ser "usuario", "trabajador" o "admin"')
];