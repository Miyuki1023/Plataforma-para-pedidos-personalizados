const { body } = require('express-validator');

const categoryValues = [
  'recommendation',
  'feedback',
  'complaint',
  'question',
  'Recomendación',
  'Sugerencia',
  'Queja',
  'Pregunta'
];

exports.createReclamacionValidation = [
  body('name')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 100 }).withMessage('El nombre debe tener máximo 100 caracteres'),

  body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email es inválido'),

  body('category')
    .notEmpty().withMessage('El tipo de mensaje es requerido')
    .isIn(categoryValues).withMessage('Tipo de mensaje inválido'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser un número entre 1 y 5'),

  body('message')
    .notEmpty().withMessage('El mensaje es requerido')
    .isLength({ min: 10, max: 500 }).withMessage('El mensaje debe tener entre 10 y 500 caracteres')
];
