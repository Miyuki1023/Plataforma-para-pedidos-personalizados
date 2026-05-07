const { body } = require('express-validator');

exports.registerValidation = [
  body('usuario')
    .notEmpty().withMessage('Usuario es requerido')
    .isLength({ min: 3 }).withMessage('Usuario mínimo 3 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Usuario solo puede contener letras, números y guiones bajos'),

  body('email')
    .notEmpty().withMessage('Email es requerido')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .notEmpty().withMessage('Password es requerido')
    .isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres')
    .matches(/[A-Z]/).withMessage('Debe tener al menos 1 mayúscula')
    .matches(/[0-9]/).withMessage('Debe tener al menos 1 número'),

  // Optional fields for registration
  body('fecha_nacimiento')
    .optional()
    .isISO8601().withMessage('Fecha de nacimiento debe tener formato YYYY-MM-DD')
    .custom((value) => {
      if (!value) return true; // Allow empty
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
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Usuario solo puede contener letras, números y guiones bajos'),

  body('email')
    .notEmpty().withMessage('Email es requerido')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .notEmpty().withMessage('Password es requerido')
    .isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres')
    .matches(/[A-Z]/).withMessage('Debe tener al menos 1 mayúscula')
    .matches(/[0-9]/).withMessage('Debe tener al menos 1 número'),

  body('rol')
    .notEmpty().withMessage('Rol es requerido')
    .isIn(['trabajador', 'admin']).withMessage('Rol debe ser "trabajador" o "admin"'),

  // Optional fields for admin registration
  body('fecha_nacimiento')
    .optional()
    .isISO8601().withMessage('Fecha de nacimiento debe tener formato YYYY-MM-DD')
    .custom((value) => {
      if (!value) return true; // Allow empty
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