const pool = require('../config/db');

exports.getProducts = async () => {
  const result = await pool.query(`
    SELECT 
      id,
      nombre,
      precio,
      categoria,
      disponible,
      imagen_url,
      stock
    FROM producto
    WHERE disponible = true
    ORDER BY id ASC
  `);

  return result.rows;
};