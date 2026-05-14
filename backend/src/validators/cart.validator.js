const { body, param } = require('express-validator');

exports.createItemValidation = [
  body('productoId')
    .notEmpty().withMessage('Producto es requerido')
    .isInt({ gt: 0 }).withMessage('productoId debe ser un número válido'),

  body('cantidad')
    .notEmpty().withMessage('Cantidad es requerida')
    .isInt({ gt: 0 }).withMessage('Cantidad debe ser mayor que 0'),

  body('opciones')
    .optional()
    .isObject().withMessage('Opciones debe ser un objeto válido')
];

exports.updateItemValidation = [
  param('itemId')
    .notEmpty().withMessage('Item ID es requerido')
    .isInt({ gt: 0 }).withMessage('itemId debe ser un número válido'),

  body('cantidad')
    .optional()
    .isInt({ gt: 0 }).withMessage('Cantidad debe ser mayor que 0'),

  body('opciones')
    .optional()
    .isObject().withMessage('Opciones debe ser un objeto válido')
];

exports.syncCartValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('Items es requerido y debe ser un arreglo'),

  body('items.*.productoId')
    .notEmpty().withMessage('productoId es requerido')
    .isInt({ gt: 0 }).withMessage('productoId debe ser un número válido'),

  body('items.*.cantidad')
    .notEmpty().withMessage('Cantidad es requerida')
    .isInt({ gt: 0 }).withMessage('Cantidad debe ser mayor que 0'),

  body('items.*.opciones')
    .optional()
    .isObject().withMessage('Opciones debe ser un objeto válido')
];
