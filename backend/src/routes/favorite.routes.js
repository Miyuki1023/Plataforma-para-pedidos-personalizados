const express = require('express');
const router = express.Router();

const favoriteController = require('../controllers/favorite.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * TODAS LAS RUTAS PROTEGIDAS
 */
router.use(authMiddleware);

/**
 * GET favoritos del usuario
 */
router.get('/', favoriteController.getFavorites);

/**
 * POST agregar favorito
 */
router.post('/:productId', favoriteController.addFavorite);

/**
 * DELETE eliminar favorito
 */
router.delete('/:productId', favoriteController.removeFavorite);

/**
 * DELETE limpiar todos
 */
router.delete('/', favoriteController.clearFavorites);

module.exports = router;