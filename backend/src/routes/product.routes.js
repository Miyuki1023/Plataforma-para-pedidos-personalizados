const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

// Productos
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Actualizar stock
router.put('/:id/stock', productController.updateStock);

// Opciones de personalización
router.get('/:id/options', productController.getProductOptions);

router.post('/:id/options', productController.createProductOption);
router.put('/:id/options/:optionId', productController.updateProductOption);
router.delete('/:id/options/:optionId', productController.deleteProductOption);

module.exports = router;