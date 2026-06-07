const { body } = require('express-validator');

exports.registerValidation = [
  body('usuario')
    .notEmpty().withMessage('Usuario es requerido')
    .isLength({ min: 3 }).withMessage('Usuario mínimo 3 caracteres')
    .matches(/^[a-zA-Z0-9_.@]+$/).withMessage('Usuario solo puede contener letras, números, puntos, @ y guiones bajos'),

  body('email')
    .notEmpty().withMessage('Email es requerido')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .notEmpty().withMessage('Password es requerido')
    .isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres'),

  // Campos opcionales para registro
  body('fecha_nacimiento')
    .optional()
    .isISO8601().withMessage('Fecha de nacimiento debe tener formato YYYY-MM-DD')
    .custom((value) => {
      if (!value) return true; // Permitir vacío
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        throw new Error('Debes tener al menos 13 años');
      }
      if (age > 120) {
        throw new Error('Fecha de nacimiento inválida');
      }
      return true;
    }),

  body('sexo')
    .optional()
    .isIn(['M', 'F', 'Otro']).withMessage('Sexo debe ser M, F u Otro'),

  body('telefono')
    .optional()
    .matches(/^[\+]?[0-9\-\s]+$/).withMessage('Teléfono debe contener solo números, espacios, guiones y el símbolo +')
    .isLength({ min: 7, max: 15 }).withMessage('Teléfono debe tener entre 7 y 15 caracteres')
];

exports.loginValidation = [
  body('email')
    .notEmpty().withMessage('Email es requerido')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .notEmpty().withMessage('Password es requerido')
];

exports.adminRegisterValidation = [
  body('usuario')
    .notEmpty().withMessage('Usuario es requerido')
    .isLength({ min: 3 }).withMessage('Usuario mínimo 3 caracteres')
    .matches(/^[a-zA-Z0-9_.@]+$/).withMessage('Usuario solo puede contener letras, números, puntos, @ y guiones bajos'),

  body('email')
    .notEmpty().withMessage('Email es requerido')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .notEmpty().withMessage('Password es requerido')
    .isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres'),

  body('rol')
    .notEmpty().withMessage('Rol es requerido')
    .isIn([2, 3]).withMessage('Rol debe ser 2 (trabajador) o 3 (admin)'),

  // Campos opcionales para registro de admin
  body('fecha_nacimiento')
    .optional()
    .isISO8601().withMessage('Fecha de nacimiento debe tener formato YYYY-MM-DD')
    .custom((value) => {
      if (!value) return true; // Permitir vacío
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        throw new Error('Debes tener al menos 13 años');
      }
      if (age > 120) {
        throw new Error('Fecha de nacimiento inválida');
      }
      return true;
    }),

  body('sexo')
    .optional()
    .isIn(['M', 'F', 'Otro']).withMessage('Sexo debe ser M, F u Otro'),

  body('telefono')
    .optional()
    .matches(/^[\+]?[0-9\-\s]+$/).withMessage('Teléfono debe contener solo números, espacios, guiones y el símbolo +')
    .isLength({ min: 7, max: 15 }).withMessage('Teléfono debe tener entre 7 y 15 caracteres')
];