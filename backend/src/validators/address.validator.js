const { body, param } = require('express-validator');

exports.createAddressValidation = [
  // Validación de dirección
  body('direccion')
    .notEmpty().withMessage('Dirección es requerida')
    .isLength({ min: 10, max: 500 }).withMessage('Dirección debe tener entre 10 y 500 caracteres'),

  // Validación de referencia
  body('referencia')
    .optional()
    .isLength({ max: 300 }).withMessage('Referencia no puede exceder 300 caracteres'),

  // Validación de distrito
  body('id_distrito')
    .notEmpty().withMessage('Distrito es requerido')
    .isInt({ min: 1 }).withMessage('ID de distrito debe ser un número entero positivo'),

  // Validación de nombre de dirección
  body('nombre_direccion')
    .notEmpty().withMessage('Nombre de dirección es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('Nombre de dirección debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-Z0-9\s\-_áéíóúÁÉÍÓÚñÑ]+$/).withMessage('Nombre de dirección contiene caracteres inválidos')
];

exports.updateAddressValidation = [
  // Validación de ID de dirección
  param('id')
    .isInt({ min: 1 }).withMessage('ID de dirección debe ser un número entero positivo'),

  // Validación de dirección (opcional)
  body('direccion')
    .optional()
    .isLength({ min: 10, max: 500 }).withMessage('Dirección debe tener entre 10 y 500 caracteres'),

  // Validación de referencia (opcional)
  body('referencia')
    .optional()
    .isLength({ max: 300 }).withMessage('Referencia no puede exceder 300 caracteres'),

  // Validación de distrito (opcional)
  body('id_distrito')
    .optional()
    .isInt({ min: 1 }).withMessage('ID de distrito debe ser un número entero positivo'),

  // Validación de nombre de dirección (opcional)
  body('nombre_direccion')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Nombre de dirección debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-Z0-9\s\-_áéíóúÁÉÍÓÚñÑ]+$/).withMessage('Nombre de dirección contiene caracteres inválidos')
];