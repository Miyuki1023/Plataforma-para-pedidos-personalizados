const { body, param } = require('express-validator');

exports.updateRoleValidation = [
  // Validar ID de usuario en parámetro
  param('id')
    .isInt({ min: 1 }).withMessage('ID de usuario debe ser un número entero positivo'),

  // Validar rol en el cuerpo
  body('rol')
    .notEmpty().withMessage('Rol es requerido')
    .isIn([1, 2, 3]).withMessage('Rol debe ser 1 (usuario), 2 (trabajador) o 3 (admin)')
];