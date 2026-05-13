const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

// Rutas públicas
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Rutas de opciones de personalización (públicas)
router.get('/:id/options', productController.getProductOptions);

// Rutas protegidas (admin)
// TODO: Agregar middleware de autenticación y autorización
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Rutas de opciones de personalización (protegidas)
// TODO: Agregar middleware de autenticación y autorización
router.post('/:id/options', productController.createProductOption);
router.put('/:id/options/:optionId', productController.updateProductOption);
router.delete('/:id/options/:optionId', productController.deleteProductOption);

module.exports = router;