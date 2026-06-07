// c:\Users\miyuk\Downloads\union\union\backend\src\services\favorite.service.js
const pool = require('../config/db');

/**
 * Modelo Favorite para PostgreSQL
 * Gestiona la persistencia de productos favoritos por usuario
 */
const Favorite = {
  /**
   * Busca todos los productos favoritos de un usuario mediante un JOIN
   */
  getFavoritesByUser: async (userId) => {
    const query = `
      SELECT p.*, f.fecha_creacion
      FROM favorito f
      JOIN producto p ON f.producto_id = p.id
      WHERE f.usuario_id = $1
      ORDER BY f.fecha_creacion DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  /**
   * Agrega un producto a la lista de favoritos de un usuario
   */
  addFavorite: async (userId, productId) => {
    // Verificar si ya existe para evitar duplicados
    const check = await pool.query(
      'SELECT 1 FROM favorito WHERE usuario_id = $1 AND producto_id = $2',
      [userId, productId]
    );

    if (check.rows.length > 0) {
      throw new Error('El producto ya está en favoritos');
    }

    const query = `
      INSERT INTO favorito (usuario_id, producto_id, fecha_creacion)
      VALUES ($1, $2, NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [userId, productId]);
    return result.rows[0];
  },

  /**
   * Elimina un producto específico de los favoritos del usuario
   */
  removeFavorite: async (userId, productId) => {
    const query = `
      DELETE FROM favorito
      WHERE usuario_id = $1 AND producto_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [userId, productId]);

    if (result.rows.length === 0) {
      throw new Error('El producto no se encuentra en tus favoritos');
    }
    return result.rows[0];
  },

  /**
   * Elimina todos los registros de favoritos de un usuario
   */
  clearFavorites: async (userId) => {
    const query = 'DELETE FROM favorito WHERE usuario_id = $1';
    await pool.query(query, [userId]);
    return true;
  }
};

// Exportamos las funciones directamente para que el controlador las encuentre como funciones
// o asegúrate de que el controlador haga: favoriteService.addFavorite
module.exports = Favorite;