const favoriteService = require('../services/favorite.service');

/**
 * Obtener favoritos del usuario autenticado
 */
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await favoriteService.getFavoritesByUser(userId);

    res.json({
      message: 'Favoritos obtenidos correctamente',
      data: favorites
    });

  } catch (error) {
    console.error('GET FAVORITES ERROR:', error);

    res.status(500).json({
      message: 'Error al obtener favoritos',
      details: error.message
    });
  }
};

/**
 * Agregar producto a favoritos
 */
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const result = await favoriteService.addFavorite(userId, productId);

    res.status(201).json({
      message: 'Producto agregado a favoritos',
      data: result
    });

  } catch (error) {
    console.error('ADD FAVORITE ERROR:', error);

    res.status(400).json({
      message: error.message
    });
  }
};

/**
 * Eliminar producto de favoritos
 */
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const result = await favoriteService.removeFavorite(userId, productId);

    res.json({
      message: 'Producto eliminado de favoritos',
      data: result
    });

  } catch (error) {
    console.error('REMOVE FAVORITE ERROR:', error);

    res.status(400).json({
      message: error.message
    });
  }
};

/**
 * Limpiar todos los favoritos del usuario
 */
exports.clearFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    await favoriteService.clearFavorites(userId);

    res.json({
      message: 'Favoritos eliminados correctamente'
    });

  } catch (error) {
    console.error('CLEAR FAVORITES ERROR:', error);

    res.status(500).json({
      message: 'Error al limpiar favoritos',
      details: error.message
    });
  }
};