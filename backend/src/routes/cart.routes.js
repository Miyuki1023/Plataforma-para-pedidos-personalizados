const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const {
  createItemValidation,
  updateItemValidation,
  syncCartValidation
} = require('../validators/cart.validator');

router.use(authMiddleware);

router.post('/', cartController.createCart);
router.get('/', cartController.getCart);
router.post('/items', createItemValidation, validate, cartController.addItem);
router.put('/items/:itemId', updateItemValidation, validate, cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.post('/sync', syncCartValidation, validate, cartController.syncCart);

module.exports = router;
