const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

// Rutas base de productos
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct); // <-- ¡Aquí está la que causaba el 404!
router.delete('/:id', productController.deleteProduct);

// Rutas secundarias para opciones del producto
router.get('/:id/opciones', productController.getProductOptions);
router.post('/:id/opciones', productController.createOption);

module.exports = router;