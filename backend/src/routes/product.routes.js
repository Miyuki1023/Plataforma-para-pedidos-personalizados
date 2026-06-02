const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/roles.middleware');

// Rutas públicas
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Rutas de opciones de personalización (públicas)
router.get('/:id/options', productController.getProductOptions);

// Rutas protegidas (empleado/admin)
router.post('/', authMiddleware, checkRole(2, 3), productController.createProduct);
router.put('/:id', authMiddleware, checkRole(2, 3), productController.updateProduct);
router.delete('/:id', authMiddleware, checkRole(2, 3), productController.deleteProduct);

// Rutas de opciones de personalización (protegidas - empleado/admin)
router.post('/:id/options', authMiddleware, checkRole(2, 3), productController.createProductOption);
router.put('/:id/options/:optionId', authMiddleware, checkRole(2, 3), productController.updateProductOption);
router.delete('/:id/options/:optionId', authMiddleware, checkRole(2, 3), productController.deleteProductOption);

module.exports = router;