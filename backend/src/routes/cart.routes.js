const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { verifyToken } = require('../middlewares/auth'); // Consistencia con otras rutas
const validate = require('../middlewares/validate');
const {
  createItemValidation,
  updateItemValidation,
  syncCartValidation // Asegúrate de que este validador esté exportado en cart.validator.js
} = require('../validators/cart.validator');

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken);

router.post('/', cartController.createCart);
router.get('/', cartController.getCart);
router.post('/items', createItemValidation, validate, cartController.addItem);
router.put('/items/:itemId', updateItemValidation, validate, cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);

// Si este es el punto del error, comprueba que cartController.syncCart sea una función
// y que syncCartValidation no sea undefined.

// Implementamos una verificación de seguridad para que el servidor no se caiga
const syncValidator = syncCartValidation || ((req, res, next) => next());
const syncHandler = cartController.syncCart || ((req, res) => res.status(501).json({ message: 'Sincronización no implementada' }));

router.post('/sync', syncValidator, validate, syncHandler);

module.exports = router;
