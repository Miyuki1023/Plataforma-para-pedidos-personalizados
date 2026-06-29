const { body, validationResult, param, query } = require('express-validator');

// validación para crear pedido desde carrito
exports.createOrderValidation = [
  body('id_direccion')
    .optional()
    .isInt()
    .withMessage('id_direccion debe ser un número'),
  body('direccion_manual')
    .optional()
    .isString()
    .trim()
    .withMessage('direccion_manual debe ser texto'),
  body('observaciones')
    .optional()
    .isString()
    .trim()
    .withMessage('observaciones debe ser texto'),
  body('id_trabajador_asignado')
    .optional()
    .isInt()
    .withMessage('id_trabajador_asignado debe ser un número'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// validación para actualizar estado de pedido
exports.updateStatusValidation = [
  param('id')
    .isInt()
    .withMessage('ID debe ser un número'),
  body('estado_pedido')
    .isIn(['pendiente', 'preparacion', 'listo', 'entregado', 'cancelado'])
    .withMessage('Estado de pedido inválido. Debe ser: pendiente, preparacion, listo, entregado o cancelado'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// validación para buscar pedidos por ID o estado
exports.searchOrdersValidation = [
  query('id_pedido')
    .optional()
    .isInt()
    .withMessage('id_pedido debe ser un número'),
  query('estado_pedido')
    .optional()
    .isIn(['pendiente', 'preparacion', 'listo', 'entregado', 'cancelado'])
    .withMessage('Estado de pedido inválido'),
  query('id_cliente')
    .optional()
    .isInt()
    .withMessage('id_cliente debe ser un número'),
  query('fecha_inicio')
    .optional()
    .isISO8601()
    .withMessage('fecha_inicio debe ser una fecha válida (ISO8601)'),
  query('fecha_fin')
    .optional()
    .isISO8601()
    .withMessage('fecha_fin debe ser una fecha válida (ISO8601)'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page debe ser un número mayor a 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit debe ser un número entre 1 y 100'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// validación para asignar trabajador a pedido
exports.assignWorkerValidation = [
  param('id')
    .isInt()
    .withMessage('ID debe ser un número'),
  body('id_trabajador_asignado')
    .isInt()
    .withMessage('id_trabajador_asignado debe ser un número'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];